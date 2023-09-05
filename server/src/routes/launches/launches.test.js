const request = require('supertest');
const app = require('../../app')
const {
    mongoConnect,
    mongoDisconnect,
} = require('../../utils/mongo.js')


describe('Launches API', () =>{
    beforeAll(async() =>{
        await mongoConnect()
    });
    
    afterAll(async()=> {
        await mongoDisconnect()
    });

    describe('Test Get /launches', ()=>{
        test('It should respond with 200 success', async()=>{
            const response = await request(app)
            .get('/v1/launches')
            .expect(200);
        });
    });
    
    describe('Test Post /launch', ()=>{
           const completeLaunchData ={
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186 f',
            launchDate:'January 4, 2028',
           };
    
           const launchDateWithoutDate={
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186 f',
           }
    
           const launchDataWithInvalidDate= {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186 f',
            launchDate:'zoot',
           }
    
        test('It should respond with 201 created', async() =>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201)
            //we extracted the dates from our response and our request
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDateWithoutDate);
        });
    
        test('It should catch missing required properties', async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDateWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
        expect(response.body).toStrictEqual({
            error: 'Missing required launch property!',
        })
        });
        test('It should catch invalid dates', async() =>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
        expect(response.body).toStrictEqual({
            error: 'Invalid launch date',
        }) 
    });
    })

})


