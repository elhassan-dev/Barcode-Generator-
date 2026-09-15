const input = document.getElementById('input');
const barcode = document.getElementById('barcode');
const options = document.getElementById('options');
const showText = document.getElementById('showText');
const highQuality = document.getElementById('highQuality');
const generate = document.getElementById('generate');
const form = document.getElementById('form');
const inp = document.getElementById('inp');
const copy = document.querySelectorAll('.copy');
const download = document.querySelectorAll('.download');
const share = document.querySelector('.share');


function generateBarcode() {
    const text = input.value;

    if (text.trim() === "") {
        alert("Input your text");
        return;
    }

    const format = options.value;

    if (format.trim() === "") {
        alert("Select a preferable format!");
        return;
    }

    const show = showText.checked;
    const quality = highQuality.checked;

    JsBarcode(barcode, text, {
        format: format,
        text: 12345678,
        displayValue: show,
        width: quality ? 3 : 2,
        height: quality ? 120 : 100,
    });

    form.textContent = options.value;
    inp.textContent = input.value;
}


generate.addEventListener("click", generateBarcode);

input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        return;
    }

    generateBarcode();
});

options.addEventListener("change", generateBarcode);
showText.addEventListener("change", generateBarcode);
highQuality.addEventListener("change", generateBarcode);


download.forEach(button => {
    button.addEventListener("click", () => {

        const text = input.value;

        if (text.trim() === "") {
            alert("Kindly input your data!");
            return;
        }

        const raw = barcode.outerHTML;

        const svg = new Blob([raw], {
            type: "image/svg+xml"
        });

        const imgUrl = URL.createObjectURL(svg);

        const link = document.createElement("a");

        link.classList.add("href");
        link.href = imgUrl;
        link.download = "barcode.svg";
        link.click();

        URL.revokeObjectURL(imgUrl);
    });
});


copy.forEach(button => {
    button.addEventListener("click", () => {

        const text = input.value;

        if (text.trim() === "") {
            alert("Kindly input your data!");
            return;
        }

        const raw = barcode.outerHTML;

        const svg = new Blob([raw], {
            type: "image/svg+xml"
        });

        const imgUrl = URL.createObjectURL(svg);
        const img = new Image();

        img.onload = () => {

            const canvas = document.createElement("canvas");

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0);

            canvas.toBlob((pngBlob) => {

                const item = new ClipboardItem({
                    "image/png": pngBlob
                });

                navigator.clipboard.write([item])
                    .then(() => {
                        alert("Barcode copied!");
                        URL.revokeObjectURL(imgUrl);
                    })
                    .catch((error) => {
                        console.error("Copy failed:", error);
                        alert("Unable to copy barcode.");
                        URL.revokeObjectURL(imgUrl);
                    });

            }, "image/png");
        };

        img.src = imgUrl;
    });
});


share.addEventListener("click", async () => {

    const text = input.value;

    if (text.trim() === "") {
        alert("Kindly input your data!");
        return;
    }

    const raw = barcode.outerHTML;

    const svg = new Blob([raw], {
        type: "image/svg+xml"
    });

    const imgUrl = URL.createObjectURL(svg);
    const img = new Image();

    img.onload = () => {

        const canvas = document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(async (pngBlob) => {

            const file = new File(
                [pngBlob],
                "barcode.png",
                {
                    type: "image/png"
                }
            );

            if (
                !navigator.canShare ||
                !navigator.canShare({ files: [file] })
            ) {
                alert("Sharing files is not supported on this browser.");
                URL.revokeObjectURL(imgUrl);
                return;
            }

            try {
                await navigator.share({
                    files: [file],
                    title: "My Barcode",
                    text: "Generated barcode"
                });
            } catch (error) {
                console.error("Share failed:", error);
            }

            URL.revokeObjectURL(imgUrl);

        }, "image/png");
    };

    img.src = imgUrl;
});