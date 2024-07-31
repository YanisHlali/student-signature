const { getAllSchools, getSchoolById, createSchool, updateSchool, deleteSchool } = require('../controllers/schoolController');
const School = require('../models/School');

// Mock the School model methods
jest.mock('../models/School');

describe('School Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: { name: 'Test School' },
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

    describe('getAllSchools', () => {
        it('should render schools on success', async () => {
            const schools = [{ id: 1, name: 'School 1' }];
            School.getAllSchools.mockImplementation((cb) => cb(null, schools));
            await getAllSchools(req, res);
            expect(res.render).toHaveBeenCalledWith('schools', { schools });
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            School.getAllSchools.mockImplementation((cb) => cb(error));
            await getAllSchools(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });

    describe('getSchoolById', () => {
        it('should return 200 and school on success', async () => {
            const school = { id: 1, name: 'School 1' };
            School.getSchoolById.mockImplementation((id, cb) => cb(null, school));
            await getSchoolById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(school);
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            School.getSchoolById.mockImplementation((id, cb) => cb(error));
            await getSchoolById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });

    describe('createSchool', () => {
        it('should render createSchool for GET request', async () => {
            req.method = 'GET';
            await createSchool(req, res);
            expect(res.render).toHaveBeenCalledWith('createSchool');
        });

        it('should redirect to /schools on successful POST request', async () => {
            req.method = 'POST';
            School.createSchool.mockImplementation((data, cb) => cb(null, { id: 1, name: 'Test School' }));
            await createSchool(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/schools');
        });

        it('should return 500 on error during POST request', async () => {
            req.method = 'POST';
            const error = new Error('Database error');
            School.createSchool.mockImplementation((data, cb) => cb(error));
            await createSchool(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });

        it('should return 405 on invalid method', async () => {
            req.method = 'DELETE';
            await createSchool(req, res);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('updateSchool', () => {
        it('should render editSchool for GET request', async () => {
            req.method = 'GET';
            const school = { id: 1, name: 'School 1' };
            School.getSchoolById.mockImplementation((id, cb) => cb(null, school));
            await updateSchool(req, res);
            expect(res.render).toHaveBeenCalledWith('editSchool', { school });
        });

        it('should redirect to /schools on successful PUT request', async () => {
            req.method = 'PUT';
            School.updateSchool.mockImplementation((id, data, cb) => cb(null, { id: 1, name: 'Updated School' }));
            await updateSchool(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/schools');
        });

        it('should return 500 on error during PUT request', async () => {
            req.method = 'PUT';
            const error = new Error('Database error');
            School.updateSchool.mockImplementation((id, data, cb) => cb(error));
            await updateSchool(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });

        it('should return 405 on invalid method', async () => {
            req.method = 'DELETE';
            await updateSchool(req, res);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('deleteSchool', () => {
        it('should redirect to /schools on success', async () => {
            School.deleteSchool.mockImplementation((id, cb) => cb(null, {}));
            await deleteSchool(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/schools');
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            School.deleteSchool.mockImplementation((id, cb) => cb(error));
            await deleteSchool(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });
});
