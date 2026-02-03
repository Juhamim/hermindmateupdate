# Fix: Private Key Decoding Error

If you're seeing `error:1E08010C:DECODER routines::unsupported`, the private key in your `.env.local` file is not formatted correctly.

## Solution: Properly Format Your Private Key

### Option 1: Single Line Format (Recommended)

In your `.env.local` file, put the private key on a single line with `\n` escape sequences:

```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeuTCkzjcXODyI\n0YJn3zAt+EYqORG8NcY8PmxsrexvqsoVZEEtdnhRoUTM0rTSdIhFlcG06YfUu9Dg\nE20D/NOkoYcxV8bnLC10qOHOR2OWpoibj1uC2trK9TDeRFhW4ewiubRLDDYOxcR1\nATe3RlfgBgkUcQdgYefCkAOGS1SxbVeNdSF2SrU8zrsxU001q4jQMvAn3c9PgRWA\nYALFpVA292Y6h2k3Mik9lTlCk+itzNNo9jcCHmGUTFQAUEhemumwBnFLsVP0oHdE\n8yXETtBZB26aLTiA6oN0R7Tu5YRmsb+hcxS9F4pLExACR3zOK3i73+U2yNKe4E5m\n80Gzns13AgMBAAECggEAERZv2bZHsQzBW5tulh8tkS1i5GXLdn81jcPMqXCZ/TWe\nVuo5qBrSfjtF7GUcyXF5QECMn5zqnijwJkeBG4ZLBLTNGK9R/w4/AImz8aC25H+e\nQl0PJYnJN0NpVOx3tDbTVLO4aMHySenZqh0M8gK1MC2GKbi3ahVwPX6CmqEeh5FJ\n59rMdTIxw8kLBk6HtSgK3MFbXxW1tdFF+RQkGSKlTHuZYCJ5IuePQtYNt8JIznYd\nLETSXyGgBZjNlScmIhuvya68CRMNuqAjcrfH547SKe0Sh9fDu0fX688w1FH1Ym5A\nvyIuTfLqa3tFlH/ZMEy9CA68NBi+JmyESHf7WO+j6QKBgQDbAR9hQPumMS3Gi4EC\nFKDEteO8uCTdxlK64NQS9idzmkMs6KgsQDGrL6zEEFFIhXJr6WxyOkuZWIgzHdpn\n8HcABmu6lm+sKiv7I1ArN99pk1TFnWXsHLHjvlP65P64BfJbWWbLaBx9yL2F8t78\nGPztp8i3JK0L0aMmZHeRwOfGaQKBgQC5iTUHmMHOu7Pdy1+HBtqwewityY7cngbU\nmK9TPHFh7p5HAimASzWbFcnQcEmJCTTYghiqyPLCvx6hutSH1YmQwQGt1/VpiiD0\n/25O808++mjcS7P+JNlROTRX0XOk+lBI0Zoxx3KpuvdTiLUXR6l16hB1P1aQwELq\n+yBG7YI43wKBgHnePQ0McTzA/x0OAkMbIX91S/53ZiR3ORA/DiRjD/8XZ6w052iA\nbGM7S2NrRSAbCloccbl60RjLGDeBtEjEmiPMbuRM1GW0rfa5ZuI13D/OuYyiEtZ5\n/U+jWO4zwb67qGrG7BninIAuVbCVPxp/+Tdyd5HaeeUqyiQSIitccl2JAoGBAKF9\nRpYFJPPfNtBfWxd5JNIlVMmHPXzTY1iaSUhmvL2j50ohHKRZUiBZl56AjdDkHYYx\nvmywmXRey7ezmZddiu5ewCpjZW1mWAdHaOj5KEnFxY2xqsoTor/qzZ9+ZGz9nvGy\n1sZrNmd7oBiqTg0kR+ClSYv0BFHbtqM2z8JMqmL7AoGAepivhahvwKm8XU4sZm1I\ngS3IvI8brtsF1jMVLCwJJHVEhXcikYbHizjDa/0tzTLYna3/Sw5wNFNpPGHVvxu/\nfUJV0tPxYYA7S8tjHQ9zIGeFudqUnpgbif4pLYnC44preL02MH9IyVqu3v+yC3QQ\nlrz1qxwCXTUg8u/YzNICbUM=\n-----END PRIVATE KEY-----\n"
```

**Important:**
- The entire key must be on ONE line
- Use double quotes `"` around the entire key
- Keep the `\n` escape sequences (don't replace them with actual newlines)
- Include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers

### Option 2: Multi-line Format (Alternative)

Some systems support multi-line environment variables. If Option 1 doesn't work, try this:

```bash
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeuTCkzjcXODyI
0YJn3zAt+EYqORG8NcY8PmxsrexvqsoVZEEtdnhRoUTM0rTSdIhFlcG06YfUu9Dg
... (rest of key) ...
-----END PRIVATE KEY-----'
```

**Note:** This format may not work with all `.env` parsers.

## Quick Fix Steps

1. **Open your `.env.local` file**

2. **Find the `GOOGLE_PRIVATE_KEY` line**

3. **Make sure it looks like this:**
   ```bash
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your key...\n-----END PRIVATE KEY-----\n"
   ```

4. **Copy the private key from your JSON file:**
   - Open your service account JSON file
   - Copy the `private_key` value (including BEGIN/END markers)
   - Paste it into `.env.local` with quotes and `\n` escape sequences

5. **Save the file**

6. **Restart your server:**
   ```bash
   npm run dev
   ```

## Verify It's Working

After fixing, you should see in the logs:
```
[GoogleCalendar] Private key format verified (length: XXXX chars)
[GoogleCalendar] Authenticating with service account: calendar-service@...
```

If you still see the decoder error, check:
- ✅ Private key starts with `-----BEGIN PRIVATE KEY-----`
- ✅ Private key ends with `-----END PRIVATE KEY-----`
- ✅ The key is wrapped in quotes
- ✅ No extra spaces or characters before/after the key
- ✅ The `\n` characters are present (not actual newlines)

## Common Mistakes

❌ **Wrong:** Missing quotes
```bash
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
```

❌ **Wrong:** Actual newlines instead of `\n`
```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeuTCkzjcXODyI
..."
```

❌ **Wrong:** Missing BEGIN/END markers
```bash
GOOGLE_PRIVATE_KEY="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeuTCkzjcXODyI..."
```

✅ **Correct:** Single line with `\n` and quotes
```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeuTCkzjcXODyI\n...\n-----END PRIVATE KEY-----\n"
```

