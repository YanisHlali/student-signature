const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock the User model methods and jwt
jest.mock('../models/User');
jest.mock('jsonwebtoken');
jest.useFakeTimers();

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { email: 'user0@esgisign.fr', password: 'password' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks to avoid interference between tests
    });

    describe('register', () => {
        it('should return 201 and user on successful registration', async () => {
            const user = { id: 1, email: 'john@example.com' };
            User.createUser.mockImplementation((data, cb) => cb(null, user));
            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            User.createUser.mockImplementation((data, cb) => cb(error));
            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });

    describe('login', () => {
        it('should return 404 if user is not found', async () => {
            User.getUserByEmail.mockImplementation((email, cb) => cb(null, null));
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            User.getUserByEmail.mockImplementation((email, cb) => cb(error));
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });

        it('should return 401 if password is invalid', async () => {
            const user = [{ id: 1, email: 'john@example.com', password: 'hashedpassword' }];
            User.getUserByEmail.mockImplementation((email, cb) => cb(null, user));
            User.comparePassword = jest.fn().mockResolvedValue(false);
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
        });

        it('should return 200 and token if login is successful', async () => {
            const user = [{ id: 1, email: 'john@example.com', password: 'hashedpassword' }];
            const token = 'jsonwebtoken';
            User.getUserByEmail.mockImplementation((email, cb) => cb(null, user));
            User.comparePassword = jest.fn().mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);
            process.env.SECRET = 'secret';
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token });
        });
    });
});
