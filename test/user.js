var expect = require("chai").expect;
var request = require("request");
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app");


//Assertion Style
chai.should();

chai.use(chaiHttp);

describe("Test User API", () =>{


    it("returns status 200 to check if api works",function(done){
        chai.request(server)
           .get("/users/getAllusers")
           .end((err,response) =>{
               response.should.have.status(200);
               done();
           });
   });

    it("it should return list of all users",function(done){
         chai.request(server)
            .get("/users/getAllusers")
            .end((err,response) =>{
                response.body.should.be.a('array');
                done();
            }); 
    });

    it("returns status 200 to check if api works",function(done){
        chai.request(server)
           .get("/users/single-userid/611d24211afcd32220d05087")
           .end((err,response) =>{
               response.should.have.status(200);
               done();
           });
   });

    it("it should return list of all users",function(done){
         chai.request(server)
            .get("/users/single-userid/611d24211afcd32220d05087")
            .end((err,response) =>{
                response.body.should.be.a('object');
                done();
            }); 
    });


});