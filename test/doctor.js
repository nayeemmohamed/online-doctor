var expect = require("chai").expect;
var request = require("request");
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app");


//Assertion Style
chai.should();

chai.use(chaiHttp);

describe("Test Doctor API", () =>{

    var url = "http://localhost:8080/single-user";
    it("it should return list of all doctors",function(done){
        //request(url, function(error,response,body){
         //   expect(response.statusCode).to.equal(200);
         //   done();
        

         chai.request(server)
            .get("/getAllusers")
            .end((err,response) =>{
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            });

        
    });




});