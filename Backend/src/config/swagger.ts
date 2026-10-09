import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BayFlow API Documentation',
      version: '1.0.0',
      description: 'API Endpoints for BayFlow Multi-Tenant Auto Repair Shop Platform',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new account (Customer or Owner)',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    role: { type: 'string', enum: ['CUSTOMER', 'OWNER'] },
                    phoneNumber: { type: 'string', description: 'Used for WhatsApp updates' },
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Registration successful' } }
        }
      },
      '/api/auth/verify': {
        post: {
          tags: ['Authentication'],
          summary: 'Verify OTP and get JWT Tokens',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    otp: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Verified and tokens returned' } }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login to get JWT Tokens',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Logged in successfully' } }
        }
      },
      '/api/bookings': {
        post: {
          tags: ['Bookings'],
          summary: 'Customer creates a new booking',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    shopId: { type: 'string' },
                    slotTime: { type: 'string', format: 'date-time' },
                    vehicleDetails: { 
                      type: 'object',
                      properties: {
                        make: { type: 'string' },
                        model: { type: 'string' },
                        year: { type: 'number' },
                        plate: { type: 'string' }
                      }
                    },
                    issuesReported: { type: 'array', items: { type: 'string' } },
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Booking Created' } }
        }
      },
      '/api/bookings/{id}/status': {
        patch: {
          tags: ['Bookings'],
          summary: 'Update booking status (State Machine)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', description: 'Next valid state' },
                    notes: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Status Updated' } }
        }
      },
      '/api/bookings/{id}/estimate': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'Technician submits an estimate',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    labourCost: { type: 'number' },
                    partsCost: { type: 'number' },
                    notes: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Estimate added, status moved to ESTIMATE_REVIEW' } }
        }
      },
      '/api/bookings/{id}/estimate/respond': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'Customer approves or rejects estimate',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['APPROVED', 'REJECTED'] },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Estimate updated' } }
        }
      },
      '/api/bookings/{id}/qc-issue': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'QC Inspector logs a failure issue',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    description: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Issue created, sent back to IN_REPAIR' } }
        }
      },
      '/api/shops/staff': {
        post: {
          tags: ['Shop Management'],
          summary: 'Owner adds a staff member',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['SERVICE_ADVISOR', 'TECHNICIAN', 'QC_INSPECTOR', 'PARTS_PERSON'] },
                    name: { type: 'string' },
                    password: { type: 'string', description: 'Optional, will auto-generate if empty' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Staff Added' } }
        }
      },
      '/api/whatsapp/qr': {
        get: {
          tags: ['WhatsApp'],
          summary: 'Get the QR Code to link WhatsApp',
          responses: { 200: { description: 'Returns base64 QR Code' } }
        }
      },
      '/api/whatsapp/test': {
        get: {
          tags: ['WhatsApp'],
          summary: 'Test the WhatsApp Integration',
          responses: { 200: { description: 'Sends a test message' } }
        }
      }
    }
  },
  apis: [], // No need for inline comments, schema is above
};

export const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
