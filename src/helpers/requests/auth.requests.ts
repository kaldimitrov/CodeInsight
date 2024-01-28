import { setToken } from '$lib/userStore';
import http from '../http';
import type { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

export async function registerUser(data: RegisterUserDto) {
	const response = await http.post('users/register', data);
    if (response.status == 201) {

    }
	setToken(response.data.token);

	return response.data;
}

export async function loginUser(data: LoginUserDto) {
	const response = await http.post('users/login', data);
	setToken(response.data.token);
}
