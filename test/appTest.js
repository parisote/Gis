let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url= 'http://localhost:4000';

describe('Creacion usuario: ',()=>{
 it('should insert a user', (done) => {
 chai.request(url)
 .post('/user/singup')
 .send({last_name:"test", first_name: "test", user: "test", email: "test@gmail.com", password:"test", repassword:"test"})
 .end( function(err,res){
 console.log(res)
 expect(res).to.have.status(200);
 done();
 });
 });
});
