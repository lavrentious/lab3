import { roundToClosest } from "./utils";

const xInputId = "form:xInput";
const yInputId = "form:yInput";
const rInputId = "form:rInput";

class Form {
  private xRadio: HTMLInputElement;
  private yInput: HTMLInputElement;
  private rRadio: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private xValues: number[];
  private rValues: number[];

  constructor() {
    this.xRadio = document.getElementById(xInputId) as HTMLInputElement;
    this.yInput = document.getElementById(yInputId) as HTMLInputElement;
    this.rRadio = document.getElementById(rInputId) as HTMLInputElement;
    this.submitButton = document.getElementById(
      "form:submitButton",
    ) as HTMLButtonElement;

    this.xValues = this.radioValuesToArray(xInputId);
    this.rValues = this.radioValuesToArray(rInputId);
  }

  private radioValuesToArray(id: string): number[] {
    return Array.from(document.getElementsByName(id)).map(
      (x) => +x.getAttribute("value") as number,
    );
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

  public validate() {
    this.validateX();
    this.validateY();
    this.validateR();
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
    this.setSubmitActive(false);

    this.initX();
    this.initY();
    this.initR();
  }

  public initX() {
    this.xRadio = document.getElementById(xInputId) as HTMLInputElement;
    this.xRadio.addEventListener("change", () => {
      this.validateX();
    });
  }

  public initY() {
    this.yInput = document.getElementById(yInputId) as HTMLInputElement;
    this.yInput.addEventListener("focus", () => {
      this.resetY();
    });
    this.yInput.addEventListener("blur", () => {
      this.validateY();
    });
  }

  public initR() {
    this.rRadio = document.getElementById(rInputId) as HTMLInputElement;
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
        `input[name="${rInputId}"]:checked`,
      ) as HTMLInputElement
    )?.value;
  }

  private checkRadio(id: string, value: string) {
    const radios = document.getElementsByName(id);
    radios.forEach((radio: HTMLInputElement) => {
      if (radio.value === value) {
        radio.checked = true;
      }
    });
  }

  private setX(x: number) {
    const rounded = roundToClosest(x, this.xValues);
    this.checkRadio(xInputId, rounded.toString());
  }

  private setY(y: number) {
    this.yInput.value = y.toString();
  }

  private setR(r: number) {
    const rounded = roundToClosest(r, this.rValues);
    this.checkRadio(rInputId, rounded.toString());
  }

  submit(x: number, y: number, r: number) {
    const xInputHidden = document.getElementById(
      "formHidden:xInputHidden",
    ) as HTMLInputElement;
    const yInputHidden = document.getElementById(
      "formHidden:yInputHidden",
    ) as HTMLInputElement;

    xInputHidden.value = x.toString();
    yInputHidden.value = y.toString();

    xInputHidden.dispatchEvent(new Event("change"));
    yInputHidden.dispatchEvent(new Event("change"));

    document.getElementById("formHidden:submitButtonHidden").click();
    // this.validate();
    // console.log("submitting", this.getX(), this.getY(), this.getR());

    // // @ts-ignore
    // console.log(jsf);
    // // @ts-ignore
    // jsf.ajax.request(this.submitButton, null, { execute: "@form" });
  }
}

const form = new Form();

window["form"] = form;

export default form;
