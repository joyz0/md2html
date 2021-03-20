const defaultValidators = {
  required(value) {
    return !!value;
  },
};

const defaultMessages = {
  required(fieldName) {
    return `${fieldName}不能为空`;
  },
};

let errorMessages = [];

export function addValidator(obj) {
  Object.assign(defaultValidators, obj);
}

export function addMessages(obj) {
  Object.assign(defaultMessages, obj);
}

function validateOne(context, rule) {
  const validatorNames = Object.keys(defaultValidators);
  validatorNames.forEach(name => {
    if (rule[name]) {
      const currentValidator = defaultValidators[name];
      const fieldValue = context[rule.fieldName];
      if (!currentValidator(fieldValue)) {
        errorMessages.push(defaultMessages[name](rule.fieldLabel));
      }
    }
  });
}

export function validate(context, rules, success, fail) {
  const activedRules = rules.filter(rule => rule.active);
  activedRules.forEach(rule => {
    validateOne(context, rule);
  });
  if (errorMessages.length > 0) {
    fail(errorMessages);
    errorMessages = [];
  } else {
    success();
  }
}
