import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BayFlow Enterprise API Documentation',
      version: '2.0.0',
      description: 'Comprehensive API Documentation for BayFlow Multi-Tenant Auto Repair Shop Management Platform. Includes full repair lifecycle state machine, role-based access control, inventory, slot scheduling, service catalog, and notifications.',
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
      // ==========================================
      // AUTHENTICATION
      // ==========================================
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new account (Customer or Owner)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'customer@bayflow.demo' },
                    password: { type: 'string', example: 'Secret123!' },
                    role: { type: 'string', enum: ['CUSTOMER', 'OWNER'], default: 'CUSTOMER' },
                    phoneNumber: { type: 'string', example: '+923001234567', description: 'Used for WhatsApp updates' },
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Registration successful, OTP sent' } }
        }
      },
      '/api/auth/verify': {
        post: {
          tags: ['Authentication'],
          summary: 'Verify OTP and obtain JWT Tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'otp'],
                  properties: {
                    email: { type: 'string' },
                    otp: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'OTP verified, JWT token returned' } }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login to get JWT Token & user role',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
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
      '/api/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout user',
          responses: { 200: { description: 'Logged out successfully' } }
        }
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Send password reset OTP to email',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Password reset OTP sent' } }
        }
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Reset password using OTP',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'otp', 'newPassword'],
                  properties: {
                    email: { type: 'string' },
                    otp: { type: 'string' },
                    newPassword: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Password reset successfully' } }
        }
      },

      // ==========================================
      // SHOP MANAGEMENT
      // ==========================================
      '/api/shops': {
        get: {
          tags: ['Shop Management'],
          summary: 'Public list of all shops (Discovery & Landing)',
          responses: { 200: { description: 'Returns all registered shops with service counts' } }
        },
        post: {
          tags: ['Shop Management'],
          summary: 'Owner creates a new shop',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'BayFlow Auto Lahore' },
                    address: { type: 'string', example: 'Plot 42, Main Gulberg' },
                    city: { type: 'string', example: 'Lahore' },
                    phone: { type: 'string', example: '+924231234567' },
                    timezone: { type: 'string', example: 'Asia/Karachi' },
                    workingHours: {
                      type: 'object',
                      example: {
                        open: '09:00',
                        close: '18:00',
                        slotDurationMinutes: 60,
                        daysOpen: [1, 2, 3, 4, 5, 6]
                      }
                    }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Shop created successfully' } }
        }
      },
      '/api/shops/{id}': {
        get: {
          tags: ['Shop Management'],
          summary: 'Get shop details, services, and working hours',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Returns detailed shop info' } }
        },
        patch: {
          tags: ['Shop Management'],
          summary: 'Owner updates shop configuration',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    address: { type: 'string' },
                    city: { type: 'string' },
                    phone: { type: 'string' },
                    timezone: { type: 'string' },
                    workingHours: { type: 'object' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Shop updated' } }
        }
      },
      '/api/shops/{id}/team': {
        get: {
          tags: ['Shop Team'],
          summary: 'List shop staff members with roles',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'List of staff members' } }
        },
        post: {
          tags: ['Shop Team'],
          summary: 'Owner adds a staff member (SA, Tech, Parts, QC)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'role'],
                  properties: {
                    email: { type: 'string', example: 'tech.ali@bayflow.demo' },
                    role: { type: 'string', enum: ['SERVICE_ADVISOR', 'TECHNICIAN', 'PARTS_PERSON', 'QC_INSPECTOR'] },
                    name: { type: 'string', example: 'Ali Raza' },
                    phoneNumber: { type: 'string', example: '+923289082754' },
                    password: { type: 'string', description: 'Optional: auto-generated if omitted' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Staff member added and invitation credentials sent' } }
        }
      },
      '/api/shops/{id}/team/{userId}': {
        delete: {
          tags: ['Shop Team'],
          summary: 'Owner deactivates/removes a staff member',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'userId', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Staff member removed' } }
        }
      },
      '/api/shops/{id}/slots': {
        get: {
          tags: ['Slots & Scheduling'],
          summary: 'Get available booking slots for a specific date',
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'query', name: 'date', required: true, schema: { type: 'string' }, example: '2026-10-15', description: 'Date in YYYY-MM-DD' }
          ],
          responses: { 200: { description: 'List of generated slots with availability status' } }
        }
      },

      // ==========================================
      // SERVICE CATALOG
      // ==========================================
      '/api/shops/{id}/services': {
        get: {
          tags: ['Service Catalog'],
          summary: 'List services offered by shop',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'List of catalog services' } }
        },
        post: {
          tags: ['Service Catalog'],
          summary: 'Add a new service to shop catalog',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Comprehensive Engine Diagnostic' },
                    description: { type: 'string', example: 'Full computer scan, spark plugs, & compression check' },
                    durationMinutes: { type: 'number', example: 60 },
                    basePrice: { type: 'number', example: 3500 }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Service created' } }
        }
      },
      '/api/shops/{id}/services/{serviceId}': {
        patch: {
          tags: ['Service Catalog'],
          summary: 'Update a service in catalog',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'serviceId', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    durationMinutes: { type: 'number' },
                    basePrice: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Service updated' } }
        },
        delete: {
          tags: ['Service Catalog'],
          summary: 'Delete a service from catalog',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'serviceId', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Service deleted' } }
        }
      },

      // ==========================================
      // INVENTORY & PARTS MANAGEMENT
      // ==========================================
      '/api/shops/{id}/inventory': {
        get: {
          tags: ['Inventory & Parts'],
          summary: 'List shop inventory items',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search by SKU or name' },
            { in: 'query', name: 'lowStock', schema: { type: 'boolean' }, description: 'Filter only items below reorder level' }
          ],
          responses: { 200: { description: 'Returns inventory list' } }
        },
        post: {
          tags: ['Inventory & Parts'],
          summary: 'Add part to inventory catalog',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['sku', 'name', 'unitPrice'],
                  properties: {
                    sku: { type: 'string', example: 'BRK-PAD-001' },
                    name: { type: 'string', example: 'Ceramic Front Brake Pads' },
                    quantity: { type: 'number', default: 0 },
                    reorderLevel: { type: 'number', default: 5 },
                    unitPrice: { type: 'number', example: 4500 }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Part added' } }
        }
      },
      '/api/shops/{id}/inventory/{partId}': {
        patch: {
          tags: ['Inventory & Parts'],
          summary: 'Update inventory quantity, reorder level, or price',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'partId', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    sku: { type: 'string' },
                    quantity: { type: 'number' },
                    reorderLevel: { type: 'number' },
                    unitPrice: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Inventory updated' } }
        }
      },
      '/api/shops/{id}/purchase-orders': {
        get: {
          tags: ['Inventory & Parts'],
          summary: 'List all Purchase Orders for shop',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Returns purchase orders' } }
        },
        post: {
          tags: ['Inventory & Parts'],
          summary: 'Create a Purchase Order for missing or reorder parts',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['items'],
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['inventoryId', 'quantity'],
                        properties: {
                          inventoryId: { type: 'string' },
                          quantity: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Purchase Order created' } }
        }
      },
      '/api/shops/{id}/purchase-orders/{poId}/receive': {
        patch: {
          tags: ['Inventory & Parts'],
          summary: 'Receive PO delivery (Increases inventory stock)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'poId', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      description: 'Optional partial receipt items. If omitted, all items are marked received.',
                      items: {
                        type: 'object',
                        properties: {
                          inventoryId: { type: 'string' },
                          receivedQty: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Delivery received and inventory updated' } }
        }
      },
      '/api/shops/{id}/check-shortage': {
        post: {
          tags: ['Inventory & Parts'],
          summary: 'Stock-shortage check: Auto-compare required vs available parts',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['requiredParts'],
                  properties: {
                    requiredParts: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['inventoryId', 'quantity'],
                        properties: {
                          inventoryId: { type: 'string' },
                          quantity: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Returns shortage analysis' } }
        }
      },

      // ==========================================
      // BOOKING CORE & WORKFLOW
      // ==========================================
      '/api/bookings': {
        get: {
          tags: ['Bookings'],
          summary: 'Role-scoped list of bookings (Tech: assigned, SA/Owner: shop, Customer: own)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'status', schema: { type: 'string' }, description: 'Filter by state (e.g. PARTS_PENDING, QC_PENDING)' },
            { in: 'query', name: 'date', schema: { type: 'string' }, description: 'Filter by date YYYY-MM-DD' },
            { in: 'query', name: 'shopId', schema: { type: 'string' }, description: 'Optional shopId filter for Owners' }
          ],
          responses: { 200: { description: 'Role-scoped booking list' } }
        },
        post: {
          tags: ['Bookings'],
          summary: 'Customer creates a new booking',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['shopId', 'slotTime', 'vehicleDetails'],
                  properties: {
                    shopId: { type: 'string' },
                    serviceId: { type: 'string', description: 'Optional service from catalog' },
                    slotTime: { type: 'string', format: 'date-time' },
                    vehicleDetails: { 
                      type: 'object',
                      required: ['make', 'model', 'year', 'plate'],
                      properties: {
                        make: { type: 'string', example: 'Honda' },
                        model: { type: 'string', example: 'Civic' },
                        year: { type: 'number', example: 2022 },
                        plate: { type: 'string', example: 'LEA-1234' }
                      }
                    },
                    issuesReported: { type: 'array', items: { type: 'string' }, example: ['Brake vibration at high speed', 'Oil change'] },
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Booking Created' } }
        }
      },
      '/api/bookings/{id}': {
        get: {
          tags: ['Bookings'],
          summary: 'Get single booking with full relations (Estimate, Parts, QC issues, Customer, Tech)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Detailed booking object' } }
        }
      },
      '/api/bookings/{id}/history': {
        get: {
          tags: ['Bookings'],
          summary: 'Get full audit trail of booking lifecycle transitions',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Audit trail history list' } }
        }
      },
      '/api/bookings/{id}/assign': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'Assign Technician to booking (Owner / Service Advisor)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['technicianId'],
                  properties: {
                    technicianId: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Technician assigned and notified' } }
        }
      },
      '/api/bookings/{id}/status': {
        patch: {
          tags: ['Bookings (Workflow)'],
          summary: 'Update booking status (State Machine & Concurrency Lock)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { 
                      type: 'string', 
                      enum: [
                        'CONFIRMED', 'ASSIGNED', 'INSPECTING', 'ESTIMATE_REVIEW', 
                        'AWAITING_CUSTOMER', 'ESTIMATE_APPROVED', 'ESTIMATE_REJECTED', 
                        'PARTS_PENDING', 'PARTS_ORDERED', 'PARTS_READY', 'IN_REPAIR', 
                        'QC_PENDING', 'QC_IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'
                      ] 
                    },
                    notes: { type: 'string' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Status Updated successfully' } }
        }
      },
      '/api/bookings/{id}/estimate': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'Technician submits or revises an estimate',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['labourCost', 'partsCost'],
                  properties: {
                    labourCost: { type: 'number', example: 5000 },
                    partsCost: { type: 'number', example: 12000 },
                    notes: { type: 'string', example: 'Requires front rotor skim and new pads' },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Estimate recorded, SA notified' } }
        }
      },
      '/api/bookings/{id}/estimate/respond': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'Customer approves or rejects estimate',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['APPROVED', 'REJECTED'] },
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Customer decision recorded' } }
        }
      },
      '/api/bookings/{id}/parts': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'Allocate parts to booking (Deducts stock and locks price)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['items'],
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['inventoryId', 'quantity'],
                        properties: {
                          inventoryId: { type: 'string' },
                          quantity: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Parts allocated to repair' } }
        }
      },
      '/api/bookings/{id}/qc-issue': {
        post: {
          tags: ['Bookings (Workflow)'],
          summary: 'QC Inspector logs a failure issue (Reverts to IN_REPAIR)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['description'],
                  properties: {
                    description: { type: 'string', example: 'Brake pedal feels spongy during test drive' },
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Issue created, job sent back to IN_REPAIR' } }
        }
      },

      // ==========================================
      // WHATSAPP
      // ==========================================
      '/api/whatsapp/qr': {
        get: {
          tags: ['WhatsApp'],
          summary: 'Get the QR Code to link WhatsApp device',
          responses: { 200: { description: 'Returns base64 QR Code' } }
        }
      },
      '/api/whatsapp/test': {
        get: {
          tags: ['WhatsApp'],
          summary: 'Test the WhatsApp Integration live message',
          responses: { 200: { description: 'Sends a test message' } }
        }
      }
    }
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
