# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-08

### Added
- **User Management System**
  - User registration and authentication
  - JWT-based authentication middleware
  - User profile management

- **Event Management System**
  - Create, read, update, and delete events
  - Event invitation system
  - Event photo gallery with upload functionality

- **Photo Management System**
  - Photo upload and storage
  - Photo gallery display with responsive design
  - AWS S3 integration with local MockS3Service for development
  - Photo deletion with proper permissions

- **Frontend Application**
  - Angular standalone components architecture
  - Responsive design with Bootstrap styling
  - Modern UI/UX with component-based structure
  - Navigation system and routing

- **Backend API**
  - RESTful API with Express.js and TypeScript
  - PostgreSQL database with TypeORM
  - Comprehensive test coverage with Jest
  - Environment-based configuration

- **Development Tools**
  - Mock S3 service for local development
  - Comprehensive test suite
  - CI/CD pipeline configuration
  - Development and production environment separation

### Technical Stack
- **Backend**: Node.js, Express.js, TypeORM, PostgreSQL, Jest
- **Frontend**: Angular 18, TypeScript, Bootstrap, RxJS
- **Storage**: AWS S3 (production) / Local file system (development)
- **Authentication**: JWT tokens
- **Testing**: Jest with comprehensive coverage

### Notes
- This is the initial MVP release of the POV Web Application
- All core functionality is implemented and tested
- Ready for production deployment with proper AWS S3 configuration
