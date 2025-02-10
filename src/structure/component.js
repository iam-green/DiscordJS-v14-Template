const { randomUUID } = require('crypto');

const ExtendedComponent = (
  data,
) => {
  let uuid = randomUUID();
  while (ExtendedComponent.list.has(`${data.id}_${uuid}`)) uuid = randomUUID();
  const id = `${data.id}_${uuid}`;
  const component = (
    typeof data.component == 'function'
      ? data.component(new ComponentBuilderMap[data.type]({ custom_id: id }))
      : data.component
  );
  if (component)
    ExtendedComponent.list.set(id, {
      component: data,
      expire: data.options?.expire
        ? Date.now() + data.options.expire
        : undefined,
    });
  return Object.assign(component, data);
};

ExtendedComponent.list = new Map();

ExtendedComponent.removeExpired = () => {
  for (const [id, { expire }] of ExtendedComponent.list)
    if (expire && expire < Date.now()) ExtendedComponent.list.delete(id);
};

module.exports = { ExtendedComponent };