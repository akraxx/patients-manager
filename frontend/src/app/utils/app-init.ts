import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  if (environment.production) {
    return (): Promise<any> => keycloak.init({
      config: environment.keycloak, initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    });
  } else {
    return (): Promise<any> => new Promise((resolve) => {
      resolve();
    });
  }
}
