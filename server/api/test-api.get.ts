export default defineEventHandler(async () => {
  console.log('Test api called');

  await new Promise((resolve) => setTimeout(resolve, 1000*Math.random()));

  let response = [];
  for (let i = 0; i < 1000; i++) {
    response.push({
      "meta": {
        "code": "theme-a",
        "id": "a",
        "name": "A",
        "description": "It is a Theme A."
      },
      "properties": {
        "--theme-main-color-1": "#239BEB",
        "--theme-main-color-2": "#1D83C6",
        "--theme-main-color-3": "#00B9FF",
        "--theme-main-color-4": "#007AC0",
        "--theme-main-color-5": "#0093D9",
        "--theme-main-color-6": "#40CAFF",
        "--theme-main-color-7": "#4BAF00",
        "--theme-main-color-8": "#258900",
        "--theme-main-color-9": "#87D723",
        "--theme-main-color-10": "#3B8B00",
        "--theme-main-color-11": "#61B100",
        "--theme-main-color-12": "#A5E15A",
        "--theme-secondary-color-1": "#F57D0F",
        "--theme-secondary-color-2": "#DC700D",
        "--theme-secondary-color-3": "#FF9619",
        "--theme-secondary-color-4": "#FFB052",
        "--theme-secondary-color-5": "#7364D2",
        "--theme-secondary-color-6": "#9B8CFF",
        "--theme-secondary-color-7": "#E9FBC8",
        "--theme-error-color-1": "#E1195F",
        "--theme-success-color-1": "#388700",
        "--theme-general-color-1": "#FFFFFF",
        "--theme-general-color-2": "#F2F2F2",
        "--theme-general-color-3": "#B4B4B4",
        "--theme-general-color-4": "#696969",
        "--theme-general-color-5": "#323232",
        "--theme-tile-border-radius": "16px",
        "--theme-tab-focus-color-1": "#323232",
        "--theme-tab-focus-color-2": "#E6C84A",
        "--theme-tab-focus-color-3": "#FFB052",
        "button": {
          "meta": {
            "code": "button-a",
            "id": "a",
            "name": "A",
            "description": "It is a Button A."
          },
          "properties": {
            "--theme-button-background-color": "#239BEB",
            "--theme-button-color": "#FFFFFF",
            "--theme-button-border-radius": "8px",
            "--theme-button-font-size": "16px",
            "--theme-button-font-weight": "bold",
            "--theme-button-padding": "8px 16px",
            "--theme-button-hover-background-color": "#1D83C6",
            "--theme-button-hover-color": "#FFFFFF",
            "--theme-button-hover-border-color": "#00B9FF",
            "--theme-button-active-background-color": "#007AC0",
            "--theme-button-active-color": "#FFFFFF",
            "--theme-button-active-border-color": "#0093D9",
            "--theme-button-disabled-background-color": "#40CAFF",
            "--theme-button-disabled-color": "#FFFFFF",
            "--theme-button-disabled-border-color": "#4BAF00",
            "--theme-button-focus-background-color": "#258900",
            "--theme-button-focus-color": "#FFFFFF",
            "--theme-button-focus-border-color": "#87D723",
            "--theme-button-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
            "--theme-button-hover-shadow": "0 2px 4px rgba(0, 0, 0, 0.4)",
            "--theme-button-active-shadow": "0 2px 4px rgba(0, 0, 0, 0.6)",
            "--theme-button-disabled-shadow": "0 2px 4px rgba(0, 0, 0, 0.8)",
            "--theme-button-focus-shadow": "0 2px 4px rgba(0, 0, 0, 1)",
          }
        },
        "input": {
          "meta": {
            "code": "input-a",
            "id": "a",
            "name": "A",
            "description": "It is a Input A."
          },
          "properties": {
            "--theme-input-background-color": "#FFFFFF",
            "--theme-input-color": "#323232",
            "--theme-input-border-radius": "8px",
            "--theme" : "16px",
          }
        }
      },
      "components": {
        "button": {
          "meta": {
            "code": "button-a",
            "id": "a",
            "name": "A",
            "description": "It is a Button A."
          },
          "properties": {
            "--theme-button-background-color": "#239BEB",
            "--theme-button-color": "#FFFFFF",
            "--theme-button-border-radius": "8px",
            "--theme-button-font-size": "16px",
            "--theme-button-font-weight": "bold",
            "--theme-button-padding": "8px 16px",
            "--theme-button-hover-background-color": "#1D83C6",
            "--theme-button-hover-color": "#FFFFFF",
            "--theme-button-hover-border-color": "#00B9FF",
            "--theme-button-active-background-color": "#007AC0",
            "--theme-button-active-color": "#FFFFFF",
            "--theme-button-active-border-color": "#0093D9",
            "--theme-button-disabled-background-color": "#40CAFF",
            "--theme-button-disabled-color": "#FFFFFF",
            "--theme-button-disabled-border-color": "#4BAF00",
            "--theme-button-focus-background-color": "#258900",
            "--theme-button-focus-color": "#FFFFFF",
            "--theme-button-focus-border-color": "#87D723",
            "--theme-button-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
            "--theme-button-hover-shadow": "0 2px 4px rgba(0, 0, 0, 0.4)",
            "--theme-button-active-shadow": "0 2px 4px rgba(0, 0, 0, 0.6)",
            "--theme-button-disabled-shadow": "0 2px 4px rgba(0, 0, 0, 0.8)",
            "--theme-button-focus-shadow": "0 2px 4px rgba(0, 0, 0, 1)",
          }
        },
        "input": {
          "meta": {
            "code": "input-a",
            "id": "a",
            "name": "A",
            "description": "It is a Input A."
          },
          "properties": {
            "--theme-input-background-color": "#FFFFFF",
            "--theme-input-color": "#323232",
            "--theme-input-border-radius": "8px",
            "--theme" : "16px",
          }
        }
      },
      "layouts": {
  
        "button": {
          "meta": {
            "code": "button-a",
            "id": "a",
            "name": "A",
            "description": "It is a Button A."
          },
          "properties": {
            "--theme-button-background-color": "#239BEB",
            "--theme-button-color": "#FFFFFF",
            "--theme-button-border-radius": "8px",
            "--theme-button-font-size": "16px",
            "--theme-button-font-weight": "bold",
            "--theme-button-padding": "8px 16px",
            "--theme-button-hover-background-color": "#1D83C6",
            "--theme-button-hover-color": "#FFFFFF",
            "--theme-button-hover-border-color": "#00B9FF",
            "--theme-button-active-background-color": "#007AC0",
            "--theme-button-active-color": "#FFFFFF",
            "--theme-button-active-border-color": "#0093D9",
            "--theme-button-disabled-background-color": "#40CAFF",
            "--theme-button-disabled-color": "#FFFFFF",
            "--theme-button-disabled-border-color": "#4BAF00",
            "--theme-button-focus-background-color": "#258900",
            "--theme-button-focus-color": "#FFFFFF",
            "--theme-button-focus-border-color": "#87D723",
            "--theme-button-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
            "--theme-button-hover-shadow": "0 2px 4px rgba(0, 0, 0, 0.4)",
            "--theme-button-active-shadow": "0 2px 4px rgba(0, 0, 0, 0.6)",
            "--theme-button-disabled-shadow": "0 2px 4px rgba(0, 0, 0, 0.8)",
            "--theme-button-focus-shadow": "0 2px 4px rgba(0, 0, 0, 1)",
          }
        },
        "input": {
          "meta": {
            "code": "input-a",
            "id": "a",
            "name": "A",
            "description": "It is a Input A."
          },
          "properties": {
            "--theme-input-background-color": "#FFFFFF",
            "--theme-input-color": "#323232",
            "--theme-input-border-radius": "8px",
            "--theme" : "16px",
          }
        }
      }
    })
  }
  return response;
})