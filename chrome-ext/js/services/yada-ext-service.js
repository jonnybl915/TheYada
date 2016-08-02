/*******************************
* Yada Ext Service
* grabs yadas from the current Url
********************************/

module.exports = function(ext) {

  ext.factory('YadaExtService', ['$http','$rootScope','$location', 'UserExtService', function($http, $rootScope, $location, UserExtService){

      let yadas = [];
      let yadaIndex = 0;
      let scrapes = [];
      let yadaId = 0;
      let blankYada = [{
        content: "You should write a Yada for this article.",
        user: {
          username: "Noone, but it could be you!"
        },
        karma: 0
     }];

      return {

        /*******************************
        * Grab yadas from DB
        ********************************/
        getYadas(extUrl) {

          let currentUrl = 'http://localhost:8080/lemmieSeeTheYadas?url=' + extUrl;
          $http({
              url: currentUrl,
              method: 'GET'
            }).then(function success(response){
              console.log("get", response.data);
              currentYadas = response.data;
              if(currentYadas === '') {
                console.log("blank array on getYadas");
                angular.copy(blankYada, yadas);
                return yadas
              } else {
                  let yid = currentYadas[yadaIndex].id;
                  console.log("yid", currentYadas[yadaIndex].id, yadaIndex);
                  angular.copy(yid, yadaId);
                  angular.copy(currentYadas, yadas);
                  return yadas
              }

            }, function error(response){
              console.log("error on getYadas");
              angular.copy(blankYada, yadas);
            });
  
            return yadas;
        },

        /*******************************
        * Grab scraped text by sending current tabs url
        ********************************/
        scrapeIt(extUrl) {

          let scrapeUrl = 'http://localhost:8080/lemmieYada?url=' + extUrl;
          $http({
              url: scrapeUrl,
              method: 'GET'
            }).then(function(response){
              currentScrapes = response.data;
              angular.copy(currentScrapes, scrapes);
            })
            console.log(scrapes);
            return scrapes;
        },

        /*******************************
        * up voting yada
        ********************************/
        upKarma(yada, callback) {

            $http({
              url: 'http://localhost:8080/upVoteExt',
              method: 'POST',
              data: yada
            }).then(function(response){
              console.log(response.data);

              let link = response.data;

              angular.copy(link.yadaList, yadas);

            }).then(callback)
        },
        /*******************************
        * down voting yada
        ********************************/
        downKarma(yada, callback) {

          $http({
            url: 'http://localhost:8080/downVoteExt',
            method: 'POST',
            data: yada
          }).then(function(response){
            console.log(response.data);

            let link = response.data;

            angular.copy(link.yadaList, yadas);

          }).then(callback)
        },
        /*******************************
        * update w/out new server request
        ********************************/
        updateYadas() {
          console.log("updating");
          return yadas;
        },

        /*******************************
        * posts new yadas from editor
        ********************************/
        sendYada(extUrl, yadaText, callback) {

          $http({
            url: "http://localhost:8080/addYada",
            method: 'POST',
            data: {
              yada: {content: `${yadaText}`},
              link: {url: `${extUrl}`}
            }
          }).then(function success(response) {
            console.log("success", response);
            callback('success');
          }, function error(response){
            console.log("error", response);
            callback('error');
          });

        },

        scrollLeft() {
           if (yadaIndex <= 0) {
             yadaIndex = yadas.length -1;
             yadaId = yadas[yadaIndex].id
           } else {
             yadaIndex --;
             yadaId = yadas[yadaIndex].id
           }
        },

        scrollRight() {
           if (yadaIndex >= yadas.length -1) {
             yadaIndex = 0;
             yadaId = yadas[yadaIndex].id
           } else {
             yadaIndex ++;
             yadaId = yadas[yadaIndex].id
           }
        },

        getIndex() {
          return yadaIndex;
        },
        getYadaId() {
          return yadaId;
        }


      }
  }]);
}
