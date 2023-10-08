// tripFunctions.ts
import request from 'supertest';
import { Express } from 'express';

// Function to post a new trip
export async function postTrip(app: Express, tripData: any, token: string) {
  const response = await request(app)
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({
      query: `
        mutation {
          createTrip(input: {
            destination: "${tripData.destination}",
            startDate: "${tripData.startDate}",
            endDate: "${tripData.endDate}",
          }) {
            trip {
              id
              destination
              startDate
              endDate
            }
          }
        }
      `
    });
  return response.body.data.createTrip.trip;
}

// Function to get a single trip
export async function getSingleTrip(app: Express, tripId: string) {
  const response = await request(app)
    .post('/graphql')
    .send({
      query: `
        query {
          trip(id: "${tripId}") {
            id
            destination
            startDate
            endDate
          }
        }
      `
    });
  return response.body.data.trip;
}

// Function to update a trip
export async function updateTrip(app: Express, tripId: string, updatedData: any, token: string) {
  const response = await request(app)
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({
      query: `
        mutation {
          updateTrip(id: "${tripId}", input: {
            destination: "${updatedData.destination}",
            startDate: "${updatedData.startDate}",
            endDate: "${updatedData.endDate}",
          }) {
            trip {
              id
              destination
              startDate
              endDate
            }
          }
        }
      `
    });
  return response.body.data.updateTrip.trip;
}

// Function to delete a trip
export async function deleteTrip(app: Express, tripId: string, token: string) {
    const response = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation {
            deleteTrip(id: "${tripId}") {
              id
              destination
            }
          }
        `
      });
    return response.body.data.deleteTrip;
  }

