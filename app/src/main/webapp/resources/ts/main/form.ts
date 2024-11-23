class Form {
  private xRadio: HTMLInputElement;
  private yInput: HTMLInputElement;
  private rRadio: HTMLInputElement;
  private submitButton: HTMLButtonElement;

  constructor() {
    this.xRadio = document.getElementById("form:xInput") as HTMLInputElement;
    this.yInput = document.getElementById("form:yInput") as HTMLInputElement;
    this.rRadio = document.getElementById("form:rInput") as HTMLInputElement;
    this.submitButton = document.getElementById(
      "form:submitButton",
    ) as HTMLButtonElement;
  }

  isInt(value: string) {
    return (
      value !== "" &&
      !isNaN(+value) &&
      parseInt(Number(+value).toString()) == +value &&
      !isNaN(parseInt(value, 10))
    );
  }

  isFloat(value: string) {
    return (
      value !== "" &&
      !isNaN(+value) &&
      parseFloat(Number(+value).toString()) == +value &&
      !isNaN(parseFloat(value))
    );
  }

  checkX() {
    const x = this.getX();
    return this.isInt(x);
  }

  checkY() {
    const y = this.getY();
    return this.isFloat(y) && -5 <= +y && +y <= 5;
  }

  checkR() {
    const r = this.getR();
    return this.isFloat(r);
  }

  checkAll() {
    return this.checkX() && this.checkY() && this.checkR();
  }

  validateX() {
    this.resetX();
    const isValid = this.checkX();
    this.xRadio.classList.add(isValid ? "valid" : "invalid");
    this.setSubmitActive(this.checkAll());
    return isValid;
  }

  validateY() {
    this.resetY();
    const isValid = this.checkY();
    this.yInput.classList.add(isValid ? "valid" : "invalid");
    this.setSubmitActive(this.checkAll());
    return isValid;
  }

  validateR() {
    this.resetR();
    const isValid = this.checkR();
    this.rRadio.classList.add(isValid ? "valid" : "invalid");
    this.setSubmitActive(this.checkAll());
    return isValid;
  }

  resetX() {
    this.xRadio.classList.remove("valid");
    this.xRadio.classList.remove("invalid");
  }

  resetY() {
    this.yInput.classList.remove("valid");
    this.yInput.classList.remove("invalid");
  }

  resetR() {
    this.rRadio.classList.remove("valid");
    this.rRadio.classList.remove("invalid");
  }

  getFormData() {
    if (this.checkAll())
      return {
        x: this.getX(),
        y: this.getY(),
        r: this.getR(),
      };
  }

  init(onSubmit?: () => void) {
    this.xRadio.addEventListener("change", () => {
      this.validateX();
    });
    this.yInput.addEventListener("focus", () => {
      this.resetY();
    });
    this.yInput.addEventListener("blur", () => {
      this.validateY();
    });
    this.rRadio.addEventListener("change", () => {
      this.validateR();
    });
  }

  resetForm() {
    this.yInput.value = "";
    this.rRadio.checked = false;
    this.xRadio.checked = false;
    this.resetX();
    this.resetY();
    this.resetR();
  }

  setSubmitActive(isActive: boolean) {
    if (isActive) this.submitButton.removeAttribute("disabled");
    else this.submitButton.setAttribute("disabled", "");
  }

  getX() {
    return (
      document.querySelector(
        'input[name="form:xInput"]:checked',
      ) as HTMLInputElement
    )?.value;
  }

  getY() {
    return this.yInput.value;
  }

  getR() {
    return (
      document.querySelector(
        'input[name="form:rInput"]:checked',
      ) as HTMLInputElement
    )?.value;
  }
}

export default new Form();
