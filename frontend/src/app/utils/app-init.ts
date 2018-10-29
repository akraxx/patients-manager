import {KeycloakService} from 'keycloak-angular';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  // return (): Promise<any> => keycloak.init({config: environment.keycloak, initOptions: {
  //     onLoad: 'login-required',
  //     checkLoginIframe: false
  //   }});

  return (): Promise<any> => new Promise((resolve, reject) => {
    resolve();
  });
}
