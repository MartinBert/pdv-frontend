import Swal from 'sweetalert2';

export const errorAlert = (str) => {
    return Swal.fire({
        html:
            "<div class='text-alert-error'>" +
            "<img src='/../../images/messages/error_1.svg' />" +
            "<h1>¡Error!<h1>" +
            "<p>¡" +
            str +
            "!</p>" +
            "</div>",
        showConfirmButton: false,
    });
}
export const successAlert = (str) => {
    return Swal.fire({
        width: 300,
        html:
            "<div class='text-alert-success'>" +
            "<img src='/../../images/messages/success_1.svg' />" +
            "<h1>¡" +
            str +
            "!<h1>" +
            "</div>",
        showConfirmButton: false,
    });
}
export const successAlert2 = (str, str2) => {
    return Swal.fire({
        html:
            "<div class='text-alert-success'>" +
            "<img src='/../../images/messages/success_1.svg' />" +
            "<h1>¡" +
            str +
            "!<h1>" +
            "<p>¡"+
            str2 +
            "!</p>"+
            "</div>",
        showConfirmButton: false,
    });
}
export const questionAlert = (strTitle, strText) => {
    return Swal.fire({
        width: 400,
        html:
            "<div class='text-alert-question'>" +
            "<img src='/../../images/messages/question_1.svg' />" +
            "<h1>¡" +
            strTitle +
            "!<h1>" +
            "<p>¿" +
            strText +
            "?</p>" +
            "</div>",
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'SI',
        denyButtonText: 'NO',
        confirmButtonColor: 'rgb(63, 81, 181)',
        denyButtonColor: 'rgb(172, 171, 171)'
    });
}
export const infoAlert = (str) => {
    return Swal.fire({
        width: 400,
        html:
            "<div class='text-alert-info'>" +
            "<img src='/../../images/messages/info_1.svg' />" +
            "<h1>" +
            str +
            "...</h1>" +
            "</div>",
        showConfirmButton: false,
        showDenyButton: false,
    });
}
export const infoAlert2 = (str) => {
    return Swal.fire({
        html:
            "<div class='text-alert-info'>" +
            "<img src='/../../images/messages/info_2.svg' />" +
            "<h1>¡" +
            str +
            "!</h1>" +
            "</div>",
        showConfirmButton: false,
        showDenyButton: false,
    });
}
