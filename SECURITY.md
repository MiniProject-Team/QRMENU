# Private configuration

The backend requires DB_PASSWORD and JWT_SECRET. Optional DB_URL and
DB_USERNAME override the local PostgreSQL connection defaults.
Use environment variables in production. For development, Spring also imports
the ignored backend/src/main/resources/application-local.properties file when
started with `backend/gradlew -p backend bootRun` from the project root, or
`./gradlew bootRun` from backend:

```properties
DB_PASSWORD=<your database password>
JWT_SECRET=<a newly generated random secret of at least 32 UTF-8 bytes>
```

Generate a random signing secret with a password manager or a cryptographic
random generator. Never reuse the previously committed signing key.
Changing the signing secret invalidates existing login tokens.
Local configuration is excluded from application jars and Docker build context.
For an IDE launch, explicitly add the local file as an external Spring config
location if the IDE does not include it. Production requires DB_URL,
DB_USERNAME, DB_PASSWORD and JWT_SECRET through the hosting environment.
For initial admin creation only, set ADMIN_BOOTSTRAP_PASSWORD to a unique
password of at least 16 characters, then remove it after provisioning. Existing
admin accounts are not updated by this setting; reset their passwords separately.
Spring does not automatically load .env files. Never place secrets in VITE_
variables: frontend variables are delivered to every browser.

QRMENU.sql contains schema only. Private dumps and local configuration belong
in ignored files. Ignored files are still visible to anyone with local access;
ignore rules do not encrypt files or remove previously committed history.

# Exposure recovery before public release

Database credentials and a JWT signing key occurred in Git history. The original
dump also contained user records, password hashes, orders and payments.
Rotate every database password that occurred in history through PostgreSQL or
your hosting provider, update private configuration, deploy a fresh JWT secret,
and reset exposed user passwords, including the previously hardcoded default
admin password. Configuration edits do not rotate database
or user passwords. Review other copies, deployment logs and artifacts as well.

Remove sensitive versions from all published branches and tags using a reviewed
history cleanup, coordinated with collaborators. Keep private backups outside
published history. Existing clones and forks may retain old data; rewriting
history does not revoke exposed credentials. Re-scan the latest remote code and
history and verify rotation before making the repository public.

Enable GitHub secret scanning and push protection where available. Before each
push, review staged files and run a secret scanner against staged changes and
history. Ignore rules alone cannot prevent secrets in ordinary source files.
