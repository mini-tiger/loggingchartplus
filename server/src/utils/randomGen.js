class RandomGen{
   /**
   * 根据长度生成指定的长度的随机数
   * @param  {number} fixedLen  参数
   * @return {string}       结果
   */
    getRandomBigInt(fixedLen=10){
        const add =1, innerMax = 12 -add;
        if(fixedLen >innerMax){
            // 字符串过长截断后生成每个部分
            return generateInt(innerMax) + generateInt(fixedLen-innerMax);
        }
        let maximum = Math.pow(10, fixedLen + add);
        let minimum = maximum/10;
        let integer =  Math.floor( Math.random() * (maximum - minimum + 1) ) + minimum;
        return ("" + integer).substring(add);
    }
    /**
     * Get a random integer between `min` and `max`.
     * 
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {number} a random integer
     */
    getRandomSmallInt(min=1, max=100){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
    * Get a random floating point number between `min` and `max`.
    * 
    * @param {number} min - min number
    * @param {number} max - max number
    * @param {number} precision - precision size
    * @return {number} a random floating point number
    */
    getRandomFloat(min=1, max=10, precision = 4){
        return (Math.random() * (max - min) + min).toPrecision(precision);
    }
    getRandomStr(){
        return Math.random().toString(36).substring(2);
    }
    getRandomEncodingStr(){

    }

    gettPatternStr(pattern){

    }

    getRandomDateTime(startstr="2018-08-08T08:08:08", endstr="2020-12-12T12:12:12"){
        let startdate = new Date(startstr);
        let enddate = new Date(endstr);
        let date = new Date(+startdate + Math.random() * (enddate - startdate));
        return date.toLocaleString();
    }
    /**
     * Get a random boolean value.
     * @return {boolean} a random true/false
     */
    getRandomBool(){
        return Math.random() >= 0.5;
    }
};
module.exports = new RandomGen();