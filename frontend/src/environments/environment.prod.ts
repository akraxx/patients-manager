import {KeycloakConfig} from 'keycloak-angular';

/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// Add here your keycloak setup infos
const keycloakConfig: KeycloakConfig = {
  url: '/auth/',
  realm: 'patients-manager',
  clientId: 'frontend',
};

export const environment = {
  production: true,
  keycloak: keycloakConfig,
};
