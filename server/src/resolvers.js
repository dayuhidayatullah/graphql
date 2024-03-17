const crypto = require('crypto')

const resolvers = {
    Query: {
      getUser: async (_, data) => {
        try{
          const response = await fetch('https://jsonplaceholder.typicode.com/users')
          const data = await response.json()
          const randomUser = data[Math.floor(Math.random() * 10)]
          console.info(data)
          return {name: randomUser.name, memberNo: randomUser.id}
        }
        catch(err) {
          console.info(err, '<<<< error getUser')
        }
      },
      getPayment: (_, data) => {
        return {memberNo: data.memberNo, amount: Math.floor(Math.random() * 1000000000)}
      },
      getToken: (_, {email}) => {
        // Generate a 32-byte token
        const token = crypto.randomBytes(32).toString('hex');
        // Set expiration time to 600 seconds (10 minutes)
        const expired = 10;
        return { token, expired, email};
      },
    },
    
  };
module.exports = resolvers