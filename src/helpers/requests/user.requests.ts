import http from '../http';
import type { UpdateUserDto } from './dto/user.dto';

export function getUserInfo() {
	return http.get('users');
}

export function deleteUser() {
	return http.delete('users');
}

export function updateUser(data: UpdateUserDto) {
	return http.put('users/update', data);
}
