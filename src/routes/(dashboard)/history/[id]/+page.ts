import { error, redirect } from '@sveltejs/kit';

export function load({ params }: { params: { id: number } }) {
	redirect(303, '/history');
}
