/**
 * API tests
 */
const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dotenv = require('dotenv');

dotenv.config({ path: './.env-dev' });
mongoose.set('debug', true);
// overwrite URI
process.env.MONGO_URI = MONGO_TEST_URI;