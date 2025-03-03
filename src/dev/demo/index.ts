// A minimal example to test `webauthn-json`.
// Note: do not hardcode values in production.

import { type PublicKeyCredentialDescriptorJSON } from "../../webauthn-json";
import {
  getRegistrations,
  saveRegistration,
  setRegistrations,
  withStatus,
} from "./state";
import {
  parseCreationOptionsFromJSON,
  create,
  get,
  parseRequestOptionsFromJSON,
  supported,
  AuthenticationPublicKeyCredential,
} from "../../webauthn-json/browser-ponyfill";

function registeredCredentials(): PublicKeyCredentialDescriptorJSON[] {
  return getRegistrations().map((reg) => ({
    id: reg.rawId,
    type: reg.type,
  }));
}

async function register(): Promise<void> {
  const apiUrl = "http://localhost:10101/api/webauth"
  const login = "testLogin"
  const regStartResponse = await fetch(`${apiUrl}/registration/start?login=${login}`)
  const regStartResponseText = await regStartResponse.text()

  console.log(`/registration/start response: ${regStartResponseText}`)

  const regPublicKey = JSON.parse(regStartResponseText)

  const cco = parseCreationOptionsFromJSON(regPublicKey)

  const registration = await create(cco)

  console.log(`registration: ${JSON.stringify(registration)}`)

  const regFinishResponse = await fetch(`${apiUrl}/registration/finish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "userName": login,
      "publicKeyCredential": JSON.stringify(registration)
    })
  })
  const regFinishResponseText = await regFinishResponse.text()
  console.log(`/registration/finish response: ${regFinishResponseText}`)

  saveRegistration(registration)
}

async function authenticate(options?: {
  conditionalMediation?: boolean;
}): Promise<AuthenticationPublicKeyCredential> {
  const apiUrl = "http://localhost:10101/api/webauth"
  const login = "testLogin"

  const authStartResponse = await fetch(`${apiUrl}/auth/start?login=${login}`)
  const authStartResponseText = await authStartResponse.text()

  console.log(`/auth/start response: ${authStartResponseText}`)

  const cro = parseRequestOptionsFromJSON(JSON.parse(authStartResponseText))

  const result = get(cro)
  const authData = JSON.stringify((await result).toJSON())

  console.log(`authData: ${authData}`)

  const finishResponse = await fetch(`${apiUrl}/auth/finish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "userName": login,
      "authData": authData
    })
  })
  const finishResponseText = await finishResponse.text()
  
  console.log(`/auth/finish response: ${finishResponseText}`)

  return result
}

async function clear(): Promise<void> {
  setRegistrations([]);
}

async function testSupported() {
  document.querySelector("#supported .status")!.textContent = "…";
  document.querySelector("#supported .status")!.textContent = supported()
    ? " ✅"
    : " ❌";
}

window.addEventListener("load", () => {
  try {
    document
      .querySelector("#register")!
      .addEventListener("click", withStatus("#register .status", register));
    document
      .querySelector("#authenticate")!
      .addEventListener(
        "click",
        withStatus("#authenticate .status", authenticate),
      );
    document
      .querySelector("#clear")!
      .addEventListener("click", withStatus("#clear .status", clear));
    document
      .querySelector("#supported")!
      .addEventListener("click", testSupported);

    if (
      new URL(location.href).searchParams.get(
        "conditional-mediation-prompt-on-load",
      ) === "true"
    ) {
      authenticate({ conditionalMediation: true }).then(console.log);
    }
  } catch (e) {
    console.error(e);
  }
});
