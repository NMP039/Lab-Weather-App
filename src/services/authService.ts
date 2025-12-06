import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { User } from '../types/auth';

const googleProvider = new GoogleAuthProvider();

// Convert Firebase User to our User type
const convertUser = (firebaseUser: FirebaseUser | null): User | null => {
    if (!firebaseUser) return null;
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
    };
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return convertUser(result.user);
    } catch (error: any) {
        console.error('Error signing in with Google:', error);
        throw new Error(getErrorMessage(error.code));
    }
};

// Sign out
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        console.error('Error signing out:', error);
        throw new Error('Đăng xuất thất bại. Vui lòng thử lại.');
    }
};

// Get current user
export const getCurrentUser = (): User | null => {
    return convertUser(auth.currentUser);
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
        callback(convertUser(firebaseUser));
    });
};

// Get user-friendly error message
const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/popup-closed-by-user':
            return 'Đăng nhập bị hủy. Vui lòng thử lại.';
        case 'auth/popup-blocked':
            return 'Popup bị chặn. Vui lòng cho phép popup và thử lại.';
        case 'auth/cancelled-popup-request':
            return 'Yêu cầu đăng nhập bị hủy.';
        case 'auth/network-request-failed':
            return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
        case 'auth/too-many-requests':
            return 'Quá nhiều yêu cầu. Vui lòng đợi một lát và thử lại.';
        case 'auth/user-disabled':
            return 'Tài khoản đã bị vô hiệu hóa.';
        default:
            return 'Đăng nhập thất bại. Vui lòng thử lại.';
    }
};
