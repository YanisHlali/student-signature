const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const User = require('../models/User');

// Mock the User model methods
jest.mock('../models/User');

describe('Users Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: { firstname: 'John', lastname: 'Doe', email: 'john@example.com', password: 'password123' },
            method: 'POST'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn(),
            redirect: jest.fn(),
            end: jest.fn()
        };
    });

    describe('getAllUsers', () => {
        it('should return users on success', async () => {
            const users = [{ id: 1, firstname: 'John', lastname: 'Doe' }];
            User.getAllUsers.mockImplementation((cb) => cb(null, users));
            await getAllUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            User.getAllUsers.mockImplementation((cb) => cb(error));
            await getAllUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });

    describe('getUserById', () => {
        it('should return user on success', async () => {
            const user = { id: 1, firstname: 'John', lastname: 'Doe' };
            User.getUserById.mockImplementation((id, cb) => cb(null, user));
            await getUserById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            User.getUserById.mockImplementation((id, cb) => cb(error));
            await getUserById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });

    describe('createUser', () => {
        it('should render createUser for GET request', async () => {
            req.method = 'GET';
            await createUser(req, res);
            expect(res.render).toHaveBeenCalledWith('createUser');
        });

        it('should redirect to /students on successful POST request', async () => {
            req.method = 'POST';
            User.createUser.mockImplementation((data, cb) => cb(null, { id: 1, firstname: 'John', lastname: 'Doe' }));
            await createUser(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/students');
        });

        it('should return 500 on error during POST request', async () => {
            req.method = 'POST';
            const error = new Error('Database error');
            User.createUser.mockImplementation((data, cb) => cb(error));
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });

        it('should return 405 on invalid method', async () => {
            req.method = 'DELETE';
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        it('should render editUser for GET request', async () => {
            req.method = 'GET';
            const user = { id: 1, firstname: 'John', lastname: 'Doe' };
            User.getUserById.mockImplementation((id, cb) => cb(null, user));
            await updateUser(req, res);
            expect(res.render).toHaveBeenCalledWith('editUser', { user });
        });

        it('should return success message on successful PUT request', async () => {
            req.method = 'PUT';
            User.updateUser.mockImplementation((id, data, cb) => cb(null, { id: 1, firstname: 'John', lastname: 'Doe' }));
            await updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
        });

        it('should return 500 on error during PUT request', async () => {
            req.method = 'PUT';
            const error = new Error('Database error');
            User.updateUser.mockImplementation((id, data, cb) => cb(error));
            await updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });

        it('should return 405 on invalid method', async () => {
            req.method = 'DELETE';
            await updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('should redirect to /students on success', async () => {
            User.deleteUser.mockImplementation((id, cb) => cb(null, { affectedRows: 1 }));
            await deleteUser(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/students');
        });

        it('should return 404 if user not found', async () => {
            User.deleteUser.mockImplementation((id, cb) => cb(null, { affectedRows: 0 }));
            await deleteUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            User.deleteUser.mockImplementation((id, cb) => cb(error));
            await deleteUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });
});
