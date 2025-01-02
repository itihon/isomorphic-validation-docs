import uploadValidation from "./validation.js";

// UI side effects

const enableElement = (el) => () => el.disabled = false;
const disableElement = (el) => () => el.disabled = true;

const indicateStart = (el) => { 
    el.disabled = true;
    el.value = `${el.value} ⏳` 
};

const indicateEnd = (el) => (res) => { 
    el.value = res 
        ? `${el.value.split(' ')[0]} ✔` 
        : `${el.value.split(' ')[0]} ❌` ;
};

const uploadFile = (fileInput) => ({ target }) => {
    const file = fileInput.files[0];
    const { size, type } = file;

    // get signed url
    const getSignedUrl = (size, type) => 
        fetch(`/get-signed-url?size=${size}&type=${type}`)
            .then(res => res.json());

    // make a PUT request to S3
    const uploadToS3 = (file) => ({ id, url }) => 
        fetch(url, { method: 'PUT', body: file })
            .then(res => ({ res, id }));

    // notify the server about the image being successfuly uploaded
    const uploaded = ({ res, id }) => 
        fetch(`/image-uploaded/${id}`)
            .then(res => res.json());

    indicateStart(target);

    getSignedUrl(size, type)
        .then(uploadToS3(file))
        .then(uploaded)
        .then(indicateEnd(target))
        .catch(console.error);
};

const form = document.upload;

uploadValidation.client
    .valid(enableElement(form.uploadBtn))
    .invalid(disableElement(form.uploadBtn));

uploadValidation.client.constraints.forEach(validator => {
    const constraint = document.createElement('div');

    form.appendChild(constraint);
    
    validator   
        .valid(() => { constraint.innerText = '' })
        .invalid(() => { constraint.innerText = `🚫 ${validator.msg}` });
});

form.addEventListener('change', uploadValidation);
form.uploadBtn.addEventListener('click', uploadFile(form.file));