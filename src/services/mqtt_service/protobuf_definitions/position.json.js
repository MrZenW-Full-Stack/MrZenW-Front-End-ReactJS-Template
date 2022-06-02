/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:19:54
 * @modify date 2021-05-25 13:19:55
 * @desc [description]
 */
const positionMessageScheme = {
  fields: {
    _id_: {
      type: 'string',
      id: 1,
    },
    _conn_: {
      type: 'string',
      id: 2,
    },
    _count_: {
      type: 'fixed32',
      id: 3,
    },
    x: {
      type: 'float',
      id: 4,
    },
    y: {
      type: 'float',
      id: 5,
    },
    a: {
      type: 'float',
      id: 6,
    },
    robotDeviceId: {
      type: 'string',
      id: 7,
    },
    robotDeviceName: {
      type: 'string',
      id: 8,
    },
    robotDeviceType: {
      type: 'string',
      id: 9,
    },
    // cmd: {
    //   type: 'string',
    //   id: 10,
    // },
  },
};

module.exports = {
  nested: {
    MqttMessagePackage: {
      nested: {
        PositionMessage: positionMessageScheme,
      },
    },
  },
};
