import Swal from 'sweetalert2';

export function errorAlert(str) {
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

export function successAlert(str) {
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