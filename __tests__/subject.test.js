const { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const Subject = require('../models/Subject');

// Mock the Subject model methods
jest.mock('../models/Subject');

describe('Subjects Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: { name: 'Test Subject' },
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

    describe('getAllSubjects', () => {
        it('should render subjects on success', async () => {
            const subjects = [{ id: 1, name: 'Subject 1' }];
            Subject.getAllSubjects.mockImplementation((cb) => cb(null, subjects));
            await getAllSubjects(req, res);
            expect(res.render).toHaveBeenCalledWith('subjects', { subjects });
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            Subject.getAllSubjects.mockImplementation((cb) => cb(error));
            await getAllSubjects(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });

    describe('getSubjectById', () => {
        it('should render editSubject on success', async () => {
            const subject = { id: 1, name: 'Subject 1' };
            Subject.getSubjectById.mockImplementation((id, cb) => cb(null, subject));
            await getSubjectById(req, res);
            expect(res.render).toHaveBeenCalledWith('editSubject', { subject });
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            Subject.getSubjectById.mockImplementation((id, cb) => cb(error));
            await getSubjectById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });

    describe('createSubject', () => {
        it('should render createSubject for GET request', async () => {
            req.method = 'GET';
            await createSubject(req, res);
            expect(res.render).toHaveBeenCalledWith('createSubject');
        });

        it('should redirect to /subjects on successful POST request', async () => {
            req.method = 'POST';
            Subject.createSubject.mockImplementation((data, cb) => cb(null, { id: 1, name: 'Test Subject' }));
            await createSubject(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/subjects');
        });

        it('should return 500 on error during POST request', async () => {
            req.method = 'POST';
            const error = new Error('Database error');
            Subject.createSubject.mockImplementation((data, cb) => cb(error));
            await createSubject(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });

        it('should return 405 on invalid method', async () => {
            req.method = 'DELETE';
            await createSubject(req, res);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('updateSubject', () => {
        it('should render editSubject for GET request', async () => {
            req.method = 'GET';
            const subject = { id: 1, name: 'Subject 1' };
            Subject.getSubjectById.mockImplementation((id, cb) => cb(null, subject));
            await updateSubject(req, res);
            expect(res.render).toHaveBeenCalledWith('editSubject', { subject });
        });

        it('should redirect to /subjects on successful POST request', async () => {
            req.method = 'POST';
            Subject.updateSubject.mockImplementation((id, data, cb) => cb(null, { id: 1, name: 'Updated Subject' }));
            await updateSubject(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/subjects');
        });

        it('should return 500 on error during POST request', async () => {
            req.method = 'POST';
            const error = new Error('Database error');
            Subject.updateSubject.mockImplementation((id, data, cb) => cb(error));
            await updateSubject(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });

        it('should return 405 on invalid method', async () => {
            req.method = 'DELETE';
            await updateSubject(req, res);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('deleteSubject', () => {
        it('should redirect to /subjects on success', async () => {
            Subject.deleteSubject.mockImplementation((id, cb) => cb(null, {}));
            await deleteSubject(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/subjects');
        });

        it('should return 500 on error', async () => {
            const error = new Error('Database error');
            Subject.deleteSubject.mockImplementation((id, cb) => cb(error));
            await deleteSubject(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(error);
        });
    });
});
