import Swal, { type SweetAlertIcon, type SweetAlertOptions } from "sweetalert2";

const BASE_OPTIONS: SweetAlertOptions = {
    buttonsStyling: false,
    reverseButtons: true,
    focusConfirm: true,
    heightAuto: false,
    customClass: {
        popup: "ht-swal-popup",
        title: "ht-swal-title",
        htmlContainer: "ht-swal-text",
        confirmButton: "ht-swal-btn ht-swal-btn--primary",
        cancelButton: "ht-swal-btn ht-swal-btn--ghost",
        actions: "ht-swal-actions",
        icon: "ht-swal-icon",
    },
};

interface FeedbackOptions {
    title: string;
    text?: string;
    icon?: SweetAlertIcon;
    confirmButtonText?: string;
    allowOutsideClick?: boolean;
}

export function feedbackAlert(opts: FeedbackOptions) {
    return Swal.fire({
        ...BASE_OPTIONS,
        icon: opts.icon ?? "info",
        title: opts.title,
        text: opts.text,
        confirmButtonText: opts.confirmButtonText ?? "Ok",
        allowOutsideClick: opts.allowOutsideClick ?? true,
        allowEscapeKey: true,
    });
}

export function successAlert(title: string, text?: string, confirmText = "Continuar") {
    return feedbackAlert({
        icon: "success",
        title,
        text,
        confirmButtonText: confirmText,
        allowOutsideClick: false,
    });
}

export function errorAlert(title: string, text?: string) {
    return feedbackAlert({
        icon: "error",
        title,
        text,
        confirmButtonText: "Entendi",
    });
}

interface ConfirmOptions {
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: SweetAlertIcon;
    isDestructive?: boolean;
}

export async function confirmAlert(opts: ConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
        ...BASE_OPTIONS,
        icon: opts.icon ?? "question",
        title: opts.title,
        text: opts.text,
        showCancelButton: true,
        confirmButtonText: opts.confirmButtonText ?? "Confirmar",
        cancelButtonText: opts.cancelButtonText ?? "Cancelar",
        customClass: {
            ...BASE_OPTIONS.customClass,
            confirmButton: opts.isDestructive
                ? "ht-swal-btn ht-swal-btn--danger"
                : "ht-swal-btn ht-swal-btn--primary",
        },
    });
    return result.isConfirmed;
}

export function loadingAlert(title: string, text?: string) {
    Swal.fire({
        ...BASE_OPTIONS,
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });
}

export function closeAlert() {
    Swal.close();
}
