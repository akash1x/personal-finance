# Can I put APP_GUARD in AuthModule?

In NestJS, the behavior depends entirely on **where** you register that provider.

Even though you are inside the `AuthModule`, because you are using the `APP_GUARD` token, NestJS treats this as a **global enhancement**.

### The Short Answer

**No, you do not need to move it to the `AppModule`.** When you use the `provide: APP_GUARD` syntax, NestJS registers that guard at the **root level** of the application, regardless of which module it's defined in. It will effectively protect every controller in every module (unless you use a `@Public()` decorator to skip it).

---

### How Global Guards Work

When NestJS compiles your dependency injection tree, it looks for specific "multi-provider" tokens like `APP_GUARD`, `APP_INTERCEPTOR`, or `APP_PIPE`.

- **The Benefit:** It keeps your `AuthModule` encapsulated. All authentication logic (the guard, the service, the controller) stays in one folder.
- **The Result:** Even though it sits in `AuthModule`, it is instantiated and applied to every route in your entire application.

### Why some people put it in `AppModule`

You might see tutorials placing it in `AppModule` simply for **visibility**. It makes it immediately obvious to any developer looking at the root of the project that the entire app is protected by default. However, from a functional standpoint, having it in `AuthModule` is perfectly valid and often cleaner for modular architecture.
