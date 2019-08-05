// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: "0.0.2",

  UrlAuth: "//oauth.avalarabrasil.com.br",
  Auth_AppId: "e3225eba-aaaf-4a07-a5cd-b0d41b46e28f",
  Auth_Token: "bcdwied1pwsvw2ynxe3kfz01",

  // QA
  //Auth_AppId: "9fb28246-ab5d-43a0-8769-386d7210589e", // QA
  //Auth_Token: '24313aac-2792-46f9-a1fd-329749bef9b7',

  ///* TESTE TAX DEV <<<<<<<<<<<<*/
  //Auth_AppId: "77aacebd-682e-47df-bc57-e3baae57daad",
  //Auth_Token: "bcdwied1pwsvw2ynxe3kfz01",


  RuleTypeValidateId: '7B3E451C-B414-4917-A500-AFE40EBAFBF3',


  MockBackEnd: true,
  UsuarioSenhaFixo: {
    Usuario: "adm.keeptrueprojeto",
    Senha: "adm123!"
  },
  //UrlApiTaxIntelligence: "http://192.168.15.42/txi.api/api/",
  UrlApiTaxIntelligence: "https://txiapi.azurewebsites.net/api/",
  //UrlApiTaxIntelligence: "http://localhost:5200/api/",
  //UrlApiTaxIntelligence: "https://txiapi.azurewebsites.net/api/", //"http://apitaxia.onetech.com.br/api/", //localhost
  //UrlApiTaxIntelligence: "http://taxintelligenceapi.azurewebsites.net/api/",  //api

  subscriptionId: '86E367C8-D900-410E-BA73-D92C234C52CD',
  userName: 'Bruno Lima'
  //subscriptionId: '9fe9c37a-1da8-4b8e-9d1b-21207b21e9f9' // Avalara Brasil

  //subscriptionId: '168124FC-C6F6-41EC-A37F-C194E429A9CA',
  //UrlApiTaxIntelligence: "//api-taxintelligence.avalarabrasil.com.br",
};
