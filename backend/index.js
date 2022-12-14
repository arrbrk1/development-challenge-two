"use-strict";

const { util, DynamoDB } = require("aws-sdk");
const ddb = new DynamoDB.DocumentClient();

const patientPath = "/patient";
const patientsPath = "/patients";


exports.handler = async (event) => {
  console.log({ event: event });

  let response;
  let statusCode = 200;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5174",
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const bodyResponse = JSON.parse(event?.body);

    if (typeof bodyResponse === "undefined") {
      response = buildResponse(400, {
        error: "Bad Request",
        message: "Missing body",
      });
      return;
    }

    const method = event?.httpMethod || "GET";
    const path = event?.path;
    const id = event?.pathParameters?.id || "";

    const requestHandlers = [
      {
        method: "GET",
        path: patientsPath,
        handle: () => (response = getAllPatients()),
      },
      {
        method: "GET",
        path: `${patientPath}/${id}`,
        handle: () => (response = getPatientById(id)),
      },
      {
        method: "PUT",
        path: `${patientPath}/${id}`,
        handle: () => (response = updatePatient(id, bodyResponse)),
      },
      {
        method: "POST",
        path: patientPath,
        handle: () => (response = createPatient(bodyResponse)),
      },
      {
        method: "DELETE",
        path: `${patientPath}/${id}`,
        handle: () => (response = deletePatient(id)),
      },
      {
        default: () => {
          throw new Error(
            `Unsupported method "${event.httpMethod}" at path: "${
              event.path
            }", path parameters are ${JSON.stringify(event.pathParameters)}`
          );
        },
      },
    ];

    const handler = requestHandlers.find(
      (handler) => handler.method === method && handler.path === path
    );

    if (!handler) {
      response = await requestHandlers
        .find((handler) => handler.default)
        .handle();
    }

    response = await handler.handle();
  } catch (err) {
    statusCode = 400;
    response = {
      message: err.message,
    };

    console.error({ err });
  } finally {
    response = JSON.stringify(response);
  }

  return {
    statusCode,
    body: response,
    headers,
  };
};

function buildResponse(statusCode, responseBody) {
  return {
    statusCode,
    ...responseBody,
  };
}

async function getAllPatients() {
  const { Items: patients } = await ddb
    .scan({
      TableName: "patient",
    })
    .promise();

  const body = {
    patients: patients,
  };

  return buildResponse(200, body);
}

async function getPatientById(id) {
  const { Item: patient } = await ddb
    .get({
      TableName: "patient",
      Key: {
        id,
      },
    })
    .promise();

  return buildResponse(200, patient);
}

async function deletePatient(id) {
  await ddb
    .delete({
      TableName: "patient",
      Key: {
        id,
      },
    })
    .promise();

  return buildResponse(204, {
    message: "deleted",
    deleted: true,
  });
}

async function updatePatient(id, bodyResponse) {
  await ddb
    .put({
      TableName: "patient",
      Item: {
        id,
        ...bodyResponse,
      },
    })
    .promise();

  return buildResponse(200, {
    message: "updated",
    updated: true,
  });
}

async function createPatient(bodyResponse) {
  const id = util.uuid.v4();

  await ddb
    .put({
      TableName: "patient",
      Item: {
        id,
        ...bodyResponse,
      },
    })
    .promise();

  return buildResponse(201, {
    message: "created",
    patient: { id, ...bodyResponse },
  });
}

exports.clearDb = async () => {
  const { Items: patients } = await ddb
    .scan({
      TableName: "patient",
    })
    .promise();

  const deleteRequests = patients.map((patient) => ({
    DeleteRequest: {
      Key: {
        id: patient.id,
      },
    },
  }));

  const params = {
    RequestItems: {
      patient: deleteRequests,
    },
  };

  await ddb.batchWrite(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "deleted",
      deleted: true,
    }),
  };
};