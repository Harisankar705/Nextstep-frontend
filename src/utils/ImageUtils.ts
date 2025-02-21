const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getImageURL = (
    imagePath: string | undefined,
    type: 'profile-pictures' | 'posts' | 'company-documents'|'company-logos',
    defaultImage: string = '/default-profile.png'
): string => {
    try {
        if (!imagePath) return defaultImage;
        const fileName = imagePath.includes('\\')
            ? imagePath.split('\\').pop()
            : imagePath;
        return `${BASE_URL}/${type}/${fileName}?t=${new Date().getTime()}`;
    } catch (error) {
        return defaultImage;
    }
};
export const getProfilePictureURL = (profilePicture: string | undefined): string => {
    return getImageURL(profilePicture, 'profile-pictures', '/default-profile.png');
};
export const getPostImageURL = (postImage: string | undefined): string => {
    return getImageURL(postImage, 'posts', '/default-post.png');
};
export const getCompanyDocumentURL = (document: string | undefined): string => {
    return getImageURL(document, 'company-documents', '/default-document.png');
};
export const getCompanyLogo = (logo: string | undefined): string => {
    return getImageURL(logo, 'company-logos', '/default-document.png');
};
export const getResumeFileURL = (resumePath: string | undefined): string => {
    if (!resumePath) return '/default-resume.pdf'; 
    const fileName = resumePath.split('\\').pop(); 
    return `${BASE_URL}/profile-pictures/${fileName}`; 
};
