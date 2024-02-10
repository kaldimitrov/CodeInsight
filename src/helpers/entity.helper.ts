import type { FileModel } from '$lib/models/file.model';
import type { FileDto } from './requests/dto/code.dto';

export function mapFilesToDto(fileModels: FileModel[], parentPath: string = ''): FileDto[] {
	let fileDtos: FileDto[] = [];

	fileModels.forEach((fileModel) => {
		const currentPath = parentPath ? `${parentPath}/${fileModel.label}` : fileModel.label;

		if (fileModel.content) {
			fileDtos.push({ path: currentPath, content: fileModel.content });
		}

		if (fileModel.children && fileModel.children.length > 0) {
			const childDtos = mapFilesToDto(fileModel.children, currentPath);
			fileDtos = fileDtos.concat(childDtos);
		}
	});

	return fileDtos;
}
