import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    awesomeThings = [];
    newThing = '';


    /*@ngInject*/
    constructor($http, $scope, socket, Auth) {
        this.$http = $http;
        this.socket = socket;
        this.isLoggedIn = Auth.isLoggedInSync;

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
        });
    }

    $onInit() {
        this.$http.get('/api/things')
            .then(response => {
                this.awesomeThings = response.data;
                this.socket.syncUpdates('thing', this.awesomeThings);
            });
    }

    addThing() {
        if (this.newThing) {
            this.$http.post('/api/things', {
                name: this.newThing
            });
            this.newThing = '';
        }
    }

    deleteThing(thing) {
        this.$http.delete(`/api/things/${thing._id}`);
    }

    //verify
    verify() {
        if (!this.isLoggedIn()) {
            alert('Debe iniciar sesión');
        }
    }
}

export default angular.module('colombiaApp.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController
    })
    .name;