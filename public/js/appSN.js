var app = angular.module('myApp', ['ngResource',]);
//////////////////////////////////////////////////////////////

app.factory('captcha', function ($resource) {
    return $resource('/captcha/:storename', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});








