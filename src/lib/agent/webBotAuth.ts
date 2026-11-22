/**
 * Web Bot Auth directory at `/.well-known/http-message-signatures-directory`.
 *
 * Publishes one Ed25519 public JWK. The matching private key is not in this repository and
 * is not required to call the public API. Unsigned requests still succeed. The directory is
 * the verification key a future signature check would use. It is not a claim that requests
 * are rejected without a signature.
 *
 * Connects to:
 * - `surfaces.ts` emits the JSON. `developerDocs.ts` describes the limit.
 */
export const WEB_BOT_AUTH_DIRECTORY_PATH = "/.well-known/http-message-signatures-directory";

/**
 * Directory document: a `keys` array of Ed25519 JWKs with `kid`, `nbf`, and `exp`.
 * `nbf` is 2026-11-22 UTC. `exp` is 2028-11-22 UTC.
 */
export function buildWebBotAuthDirectory() {
  return {
    keys: [
      {
        kty: "OKP",
        crv: "Ed25519",
        kid: "ayushrai-site-2026",
        x: "BvQcBgews581R3p5rivkM9W-Q8Ch3R_Ym2HYcqWP7mA",
        nbf: 1795305600,
        exp: 1858464000,
        use: "sig",
      },
    ],
  };
}

/** Pretty-printed directory with a trailing newline. */
export function webBotAuthDirectoryJson(): string {
  return `${JSON.stringify(buildWebBotAuthDirectory(), null, 2)}\n`;
}
