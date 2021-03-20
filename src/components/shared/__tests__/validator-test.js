import { validate, addValidator, addMessage } from '../validator';
import pattern from '../regex';

async function run() {}
describe('测试validator', () => {
  const context = {
    name: '',
    age: '18',
    major: '',
  };

  it('默认支持required', () => {
    validate(context, [
      {
        fieldLabel: '姓名',
        fieldName: 'name',
        required: true,
      },
    ])
      .then(() => {})
      .catch(err => {
        expect(err.length).toBe(1);
      });
  });

  it('其他规则需要先注册', () => {
    validator.addField('age', 'zzz', [
      { ruleName: 'number', active: true, message: '请输入数字' },
    ]);
    expect(() => (errors = validator.check())).toLowPriorityWarnDev(
      '请先注册number规则',
      {
        withoutStack: true,
      },
    );
    expect(errors.length).toBe(0);

    validator.addStrategy('number', value => {
      return pattern.number.test(value);
    });
    errors = validator.check();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('请输入数字');
  });

  it('每次check()都会清空内部缓存errors', () => {
    validator.addField('name', '', [
      { ruleName: 'required', active: true, message: '请输入name' },
    ]);
    expect(errors.length).toBe(0);
    errors = validator.check();
    expect(errors.length).toBe(1);
    errors = validator.check();
    expect(errors.length).toBe(1);
  });

  it('clean()会把注册的strategy还原和fields清空', () => {
    validator.addStrategy('phone', value => {
      return pattern.phone.test(value);
    });
    validator.addField('phone', 'zzz', [
      { ruleName: 'phone', active: true, message: '请输入手机' },
    ]);

    errors = validator.check();
    expect(errors.length).toBe(1);

    validator.clean();

    validator.addField('phone', 'zzz', [
      { ruleName: 'phone', active: true, message: '请输入手机' },
    ]);
    expect(() => (errors = validator.check())).toLowPriorityWarnDev(
      '请先注册phone规则',
      {
        withoutStack: true,
      },
    );
    expect(errors.length).toBe(0);
  });

  it('可以覆盖已存在的strategy', () => {
    validator.addStrategy('required', value => {
      return !value;
    });
    validator.addField('name', 'zzz', [
      { ruleName: 'required', active: true, message: '请输入name' },
    ]);
    errors = validator.check();
    expect(errors.length).toBe(1);
  });
});
