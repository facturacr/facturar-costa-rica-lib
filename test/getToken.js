var getToken_1 = require('../src/services/getToken');
var IS_STG = process.env.IS_STG;
var USERNAME_TEST = process.env.USERNAME_TEST;
var PASSWORD_TEST = process.env.PASSWORD_TEST;
console.log('process.env.IS_STG', IS_STG);
getToken_1["default"]({
    client_id: 'api-stag',
    client_secret: '',
    grant_type: 'password',
    username: USERNAME_TEST,
    password: PASSWORD_TEST
}).then(function (result) {
    console.log('res', result.data);
}).catch(function (e) {
    console.log('e', e.response.data);
});
