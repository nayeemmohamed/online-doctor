var expect = require("chai").expect;
var request = require("request");
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app");


//Assertion Style
chai.should();

chai.use(chaiHttp);

describe("Test Doctor API", () =>{

    //var url = "http://localhost:8080/single-user";

    it("returns status 200 to check if api works",function(done){
        chai.request(server)
           .get("/doctor/getAll")
           .end((err,response) =>{
               response.should.have.status(200);
               done();
           });
   });

    it("it should return list of all doctors",function(done){
         chai.request(server)
            .get("/doctor/getAll")
            .end((err,response) =>{
                response.body.should.be.a('array');
                done();
            }); 
    });


    it("returns status 200 to check if api works",function(done){
        chai.request(server)
           .get("/doctor/getByTime/09:30/11:40")
           .end((err,response) =>{
               response.should.have.status(200);
               done();
           });
   });

    it("it should return array of available doctors",function(done){
         chai.request(server)
            .get("/doctor/getByTime/09:30-AM/11:40-AM")
            .end((err,response) =>{
                response.body.should.be.a('array');
                done();
            }); 
    });


    it("returns status 200 to check if api works",function(done){
        const testPost = {
            doctorName: "Abc",
            doctorEmail: "abc@gmail.com",
            appointmentTime: "11:30-13:30"
        }
        chai.request(server)
           .post("/doctor/bookAppointment")
           .send(testPost)
           .end((err,response) =>{
                response.should.have.status(200);
                done();
           });
   });

    it("it should return string object",function(done){
        const testPost = {
            doctorName: "Abc",
            doctorEmail: "abc@gmail.com",
            appointmentTime: "11:30-13:30"
        }
        chai.request(server)
           .post("/doctor/bookAppointment")
           .send(testPost)
           .end((err,response) =>{
            response.body.should.be.a('object');
               done();
           });
        });

});