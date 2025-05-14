import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { query } from '../config/database';
import { IUser, UserCreationAttributes } from '../types';
import bcrypt from 'bcrypt';

interface IUserWithPasswordHash extends IUser {
    password_hash: string;
}

export const createUserInDB = async (userData: UserCreationAttributes): Promise<IUser> => {
    if (!userData.password) {
        throw new Error('Password is required to create a user in DB.');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    // Assurez-vous que votre table 'users' a des colonnes 'name', 'email', 'password_hash'
    // et gère 'created_at', 'updated_at' (par exemple, avec DEFAULT CURRENT_TIMESTAMP).
    try {
        const [result] = await query<ResultSetHeader>(sql, [userData.name, userData.email, hashedPassword]);
        const insertId = result.insertId;

        if (!insertId) {
            throw new Error('Failed to create user, no insertId returned from DB.');
        }

        const createdUser = await findUserByIdFromDB(insertId.toString());
        if (!createdUser) {
            throw new Error('Failed to retrieve created user from DB after insertion.');
        }
        return createdUser;
    } catch (dbError: any) {
        // (par exemple, pour ER_DUP_ENTRY)
        throw dbError;
    }
};

export const findUserByIdFromDB = async (id: string): Promise<IUser | null> => {
    const sql = 'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await query(sql, [id]);
    const users = rows as RowDataPacket[];
    if (users.length > 0) {
        return users[0] as IUser;
    }
    return null;
};

export const findUserByEmailWithPasswordFromDB = async (email: string): Promise<IUserWithPasswordHash | null> => {
    const sql = 'SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = ?';
    const [rows] = await query(sql, [email]);
    const users = rows as RowDataPacket[];
    if (users.length > 0) {
        return users[0] as IUserWithPasswordHash;
    }
    return null;
};

// Optionnel: une version qui ne retourne pas le hash du mot de passe
export const findUserByEmailFromDB = async (email: string): Promise<IUser | null> => {
    const sql = 'SELECT id, name, email, created_at, updated_at FROM users WHERE email = ?';
    const [rows] = await query(sql, [email]);
    const users = rows as RowDataPacket[];
    if (users.length > 0) {
        return users[0] as IUser;
    }
    return null;
};