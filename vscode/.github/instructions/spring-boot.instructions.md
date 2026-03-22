---
description: "Spring Boot coding standards. Use when writing or reviewing Spring Boot applications, REST controllers, JPA entities, repositories, services, security configuration, or Spring Boot tests. Triggers: Spring Boot, @RestController, @Service, @Repository, @Entity, JPA, Hibernate, Spring Security, SecurityFilterChain, @SpringBootTest, @WebMvcTest, application.yml, pom.xml."
applyTo: "**/*.java,**/application*.yml,**/application*.properties,**/pom.xml,**/build.gradle*"
---

# Spring Boot Standards

> Targets **Spring Boot 3.x** + **Spring Security 6.x** + **Java 17+**.
> Key breaking change from Boot 2: all imports are `jakarta.*` not `javax.*`.

---

## Project Structure

```
src/main/java/com/company/app/
├── config/          # @Configuration classes (Security, CORS, OpenAPI)
├── controller/      # @RestController — HTTP layer only, no business logic
├── service/         # @Service — business logic, @Transactional here
├── repository/      # @Repository interfaces extending JpaRepository
├── domain/          # @Entity classes + domain value objects
├── dto/             # Request/response POJOs (records preferred)
├── exception/       # Custom exceptions + @ControllerAdvice handler
└── mapper/          # Entity ↔ DTO mapping (MapStruct or manual)
```

---

## Entities (JPA)

```java
// Required: no-arg constructor (can be protected), @Id, @GeneratedValue
// Use jakarta.persistence.* — NOT javax.persistence.*

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false)
    private boolean completed = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    // JPA requires a no-arg constructor
    protected Task() {}

    public Task(String title) {
        this.title = Objects.requireNonNull(title);
    }

    // getters only — no public setters on domain fields
}
```

**Lombok on entities — strict rules:**
- **Never use `@Data` on `@Entity` classes** — it generates `equals()`/`hashCode()` traversing lazy proxies (→ `LazyInitializationException`) and `toString()` that leaks sensitive fields (passwords, tokens) into logs
- Use the explicit Lombok split instead:
  ```java
  @Entity
  @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
  @ToString(exclude = {"password", "owner"})          // always exclude lazy relations and secrets
  @EqualsAndHashCode(onlyExplicitlyIncluded = true)   // only @EqualsAndHashCode.Include fields
  public class AppUser {
      @Id @EqualsAndHashCode.Include
      private UUID id;
      // ...
  }
  ```
- Apply `@ToString(exclude = ...)` to **every** `@ManyToOne` / `@OneToMany` association and to every field holding sensitive data

**Other entity rules:**
- Never expose `@Entity` classes in API responses — always map to a DTO
- Use `Instant` for timestamps, not `Date` or `LocalDateTime` (timezone-safe)
- `@Column(nullable = false)` on every non-optional field — don't rely on DB defaults
- **Do not implement `UserDetails` directly on an `@Entity`** — create a `UserPrincipal` wrapper in `security/`:
  ```java
  // security/UserPrincipal.java
  public record UserPrincipal(AppUser user) implements UserDetails {
      @Override public String getUsername() { return user.getEmail(); }
      @Override public String getPassword() { return user.getPassword(); }
      // ...
  }
  ```

---

## DTOs

Prefer **records** for immutable request/response shapes:

```java
// Request DTO — with Bean Validation (jakarta.validation.*)
public record CreateTaskRequest(
    @NotBlank(message = "Title must not be blank")
    @Size(max = 255, message = "Title must be 255 characters or fewer")
    String title
) {}

// Response DTO
public record TaskResponse(Long id, String title, boolean completed, Instant createdAt) {}
```

---

## Repository

```java
// Extend JpaRepository<Entity, IdType> — never implement custom CRUD
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Derived query — Spring Data generates the SQL
    List<Task> findByCompletedFalseOrderByCreatedAtDesc();

    // Custom JPQL when derived queries get unreadable
    @Query("SELECT t FROM Task t WHERE t.title LIKE %:keyword%")
    List<Task> searchByTitle(@Param("keyword") String keyword);
}
```

---

## Service

```java
@Service
@Transactional(readOnly = true)   // default read-only; override with @Transactional on writes
public class TaskService {

    private final TaskRepository repo;
    private final TaskMapper mapper;

    // Constructor injection — no @Autowired needed (single constructor)
    public TaskService(TaskRepository repo, TaskMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public List<TaskResponse> findAll() {
        return repo.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest req) {
        var task = new Task(req.title());
        return mapper.toResponse(repo.save(task));
    }

    public TaskResponse findById(Long id) {
        return repo.findById(id)
            .map(mapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Task", id));
    }
}
```

---

## Controller

```java
@RestController
@RequestMapping("/api/v1/tasks")
@Validated
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest req) {
        var created = service.create(req);
        var location = URI.create("/api/v1/tasks/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
}
```

---

## Exception Handling

```java
// Custom exception
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found with id: " + id);
    }
}

// Centralized handler — one class for all exceptions
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        var details = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> new ErrorDetail(e.getField(), e.getDefaultMessage()))
            .toList();
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", "Invalid request", details));
    }

    // Never expose stack traces in production
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);   // always log — never swallow silently
        return ResponseEntity.internalServerError()
            .body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}

public record ErrorResponse(String code, String message, List<ErrorDetail> details) {
    public ErrorResponse(String code, String message) { this(code, message, List.of()); }
}
public record ErrorDetail(String field, String issue) {}
```

**Domain exceptions — never use `ResponseStatusException` in service layer:**
- Services throw domain exceptions in `exception/` — HTTP concepts (`ResponseStatusException`, `HttpStatus`) belong only in `GlobalExceptionHandler`
- Map domain exceptions to HTTP status in `GlobalExceptionHandler`, not in the service

```java
// ✅ Correct
public class EmailAlreadyInUseException extends RuntimeException { ... }
public class TodoNotFoundException extends RuntimeException { ... }

// In GlobalExceptionHandler:
@ExceptionHandler(TodoNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNotFound(TodoNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(...);
}

// ❌ Wrong — HTTP concerns in service layer
throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found");
```

---

## Spring Security 6 (Boot 3)

> `WebSecurityConfigurerAdapter` **is removed** in Spring Security 6 — use `SecurityFilterChain` beans.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())          // disable for stateless REST APIs
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

**Security configuration rules:**
- **`@AuthenticationPrincipal` in controllers — never `SecurityContextHolder`:**
  ```java
  // ✅ Correct
  @GetMapping
  public ResponseEntity<List<TodoResponse>> getAll(
          @AuthenticationPrincipal UserDetails principal) {
      return ResponseEntity.ok(service.getTodos(principal.getUsername()));
  }
  // ❌ Wrong
  String email = SecurityContextHolder.getContext().getAuthentication().getName();
  ```
- **Never expose the H2 console outside dev** — `spring.h2.console.enabled=true` must only appear in `application-dev.properties`, never in the default `application.properties`. Never add `/h2-console/**` to `permitAll()`.
- **Never add fallback values to secret env vars** — `${JWT_SECRET}` not `${JWT_SECRET:hardcoded-value}`. A missing secret at startup is a configuration error; a silent fallback is a security hole. Add `@PostConstruct` validation:
  ```java
  @PostConstruct
  public void validate() {
      if (secret == null || secret.isBlank())
          throw new IllegalStateException("JWT_SECRET environment variable must be set");
  }
  ```
- **`DataInitializer` / seed classes must have `@Profile({"dev", "test"})`** — never run seed data in production.

---

## Testing

```java
// Unit test — pure service logic, no Spring context
class TaskServiceTest {
    private TaskRepository repo = Mockito.mock(TaskRepository.class);
    private TaskMapper mapper = new TaskMapper();
    private TaskService service = new TaskService(repo, mapper);

    @Test
    void shouldThrowWhenTaskNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }
}

// Integration test — controller + Spring MVC stack, no full server
@WebMvcTest(TaskController.class)
class TaskControllerTest {
    @Autowired MockMvc mvc;
    @MockBean TaskService service;

    @Test
    void shouldReturn201WhenTaskCreated() throws Exception {
        when(service.create(any())).thenReturn(new TaskResponse(1L, "My task", false, Instant.now()));

        mvc.perform(post("/api/v1/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"title": "My task"}"""))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1));
    }
}
```

**Test annotation guide:**

| Annotation | What it loads | Use for |
|---|---|---|
| `@SpringBootTest` | Full application context | Full integration, slow |
| `@WebMvcTest` | MVC layer only | Controller tests, fast |
| `@DataJpaTest` | JPA + in-memory DB | Repository tests |
| No annotation | Nothing | Pure unit tests, fastest |

---

## Database Migrations (Liquibase)

If `liquibase-core` is present in `pom.xml`:
- **Never** generate or modify `schema.sql` — all schema changes go through a new Liquibase changeset
- Set `spring.jpa.hibernate.ddl-auto=validate` — Hibernate validates, Liquibase owns the schema
- **Never modify an existing changeset** that has been applied — create a new one instead
- For detailed patterns (add column, rename, rollback, contexts), invoke the `/liquibase` skill

---

## Common Compilation Errors to Avoid

| Error | Cause | Fix |
|---|---|---|
| `javax.persistence` not found | Spring Boot 3 uses `jakarta.*` | Replace all `javax.persistence` → `jakarta.persistence`, `javax.validation` → `jakarta.validation` |
| `WebSecurityConfigurerAdapter` not found | Removed in Security 6 | Use `SecurityFilterChain` bean |
| No default constructor for Entity | JPA requirement | Add `protected EntityName() {}` |
| `@NotNull` / `@Valid` not working | Missing `spring-boot-starter-validation` | Add to `pom.xml`: `spring-boot-starter-validation` |
| Circular dependency | Field injection creating cycles | Switch to constructor injection + `@Lazy` if unavoidable |
| Migration conflicts with Hibernate | `ddl-auto=create` + Liquibase both manage schema | Set `ddl-auto=validate` when Liquibase is present |
