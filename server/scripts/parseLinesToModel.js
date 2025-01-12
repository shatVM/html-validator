  function parseLinesToModel(lines) {
    // Розділення на рядки
    const linesArray = lines.split("\n");
  
    // Парсинг основних полів
    const protocolRegex = /Електронний протокол\s+№?\s*([^,]+)/;
    const povirkaDateRegex = /дата повірки:\s+([\d.]+\s[\d:]+)/;
    const installationRegex = /Установка проливна\s+([^,]+)/;
    const calibrationDateRegex =
      /дата калібрування:\s+([\d]{2}\.[\d]{2}\.[\d]{4})/;
  
    const protocolMatch = lines.match(protocolRegex);
    if (protocolMatch)
      counter_model["Електронний протокол №"] = protocolMatch[1].trim();
  
    const povirkaDateMatch = lines.match(povirkaDateRegex);
    if (povirkaDateMatch)
      counter_model["Дата повірки"] = povirkaDateMatch[1].trim();
  
    const installationMatch = lines.match(installationRegex);
    if (installationMatch)
      counter_model["Установка проливна"] = installationMatch[1].trim();
  
    const calibrationDateMatch = lines.match(calibrationDateRegex);
    if (calibrationDateMatch)
      counter_model["Дата калібрування"] = calibrationDateMatch[1].trim();
  
    // Парсинг тестів
    const testRegex =
      /Тест\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([А-Яа-я\s]+)\s+([\d.]+)\s+([А-Яа-я]+)\s+Фото старт\s+(\d+)[^\n]*\s+Фото фініш\s+(\d+)[^\n]*/g;
    let testMatches;
    while ((testMatches = testRegex.exec(lines)) !== null) {
      let testIndex = parseInt(testMatches[1]) - 1; // Індексація з 0
      counter_model["Тести"][testIndex]["Задана витрата, м³/год"] = parseFloat(
        testMatches[2]
      );
      counter_model["Тести"][testIndex]["Допустима похибка, %"] = parseFloat(
        testMatches[3]
      );
      counter_model["Тести"][testIndex]["Об'єм еталону, л"] = parseFloat(
        testMatches[4]
      );
      counter_model["Тести"][testIndex]["Початкове значення, л"] = parseFloat(
        testMatches[5]
      );
      counter_model["Тести"][testIndex]["Кінцеве значення, л"] = parseFloat(
        testMatches[6]
      );
      counter_model["Тести"][testIndex]["Об'єм за лічильником, л"] = parseFloat(
        testMatches[7]
      );
      counter_model["Тести"][testIndex]["Тривалість тесту, с"] = parseFloat(
        testMatches[8]
      );
      counter_model["Тести"][testIndex]["Середня витрата, м³/год"] = parseFloat(
        testMatches[9]
      );
      counter_model["Тести"][testIndex]["Статус витрати"] =
        testMatches[10].trim();
      counter_model["Тести"][testIndex]["Фактична похибка, %"] = parseFloat(
        testMatches[11]
      );
      counter_model["Тести"][testIndex]["Результат теста"] =
        testMatches[12].trim();
      counter_model["Тести"][testIndex][
        "Фото старт"
      ] = `Фото старт ${testMatches[13]}`;
      counter_model["Тести"][testIndex][
        "Фото фініш"
      ] = `Фото фініш ${testMatches[14]}`;
    }
  
    // Парсинг технічних характеристик
    counter_model["Технічні характеристики"] = linesArray[66].trim();
    counter_model["Згідно з"] = linesArray[67].trim();
    counter_model["№ лічильника"] = linesArray[68].trim();
    counter_model["Тип лічильника"] = linesArray[69].trim();
    counter_model["Рік виробництва"] = linesArray[70].trim();
    counter_model["Об'єм, м³"] = parseFloat(linesArray[71].trim());
    counter_model["Температура води, °C"] = parseFloat(linesArray[72].trim());
    counter_model["Температура повітря, °C"] = parseFloat(linesArray[73].trim());
    counter_model["Вологість повітря, %"] = parseFloat(linesArray[74].trim());
    counter_model["Результат теста"] = linesArray[75].trim();

    //console.log('counter_model',counter_model)

    return counter_model;
  }
  
  const counter_model = {
    "Електронний протокол №": "",
    "Дата повірки": "",
    "Установка проливна": "",
    "Дата калібрування": "",
    "Технічні характеристики": "",
    "Згідно з": "",
    "№ лічильника": "",
    "Тип лічильника": "",
    "Рік виробництва": "",
    "Об'єм, м³": null,
    "Температура води, °C": null,
    "Температура повітря, °C": null,
    "Вологість повітря, %": null,
    "Результат теста": "",
    Тести: [
      {
        Тест: 1,
        "Задана витрата, м³/год": null,
        "Допустима похибка, %": null,
        "Об'єм еталону, л": null,
        "Початкове значення, л": null,
        "Кінцеве значення, л": null,
        "Об'єм за лічильником, л": null,
        "Тривалість тесту, с": null,
        "Середня витрата, м³/год": null,
        "Статус витрати": "",
        "Фактична похибка, %": null,
        "Результат теста": "",
        "Фото старт": "",
        "Фото фініш": "",
      },
      {
        Тест: 2,
        "Задана витрата, м³/год": null,
        "Допустима похибка, %": null,
        "Об'єм еталону, л": null,
        "Початкове значення, л": null,
        "Кінцеве значення, л": null,
        "Об'єм за лічильником, л": null,
        "Тривалість тесту, с": null,
        "Середня витрата, м³/год": null,
        "Статус витрати": "",
        "Фактична похибка, %": null,
        "Результат теста": "",
        "Фото старт": "",
        "Фото фініш": "",
      },
      {
        Тест: 3,
        "Задана витрата, м³/год": null,
        "Допустима похибка, %": null,
        "Об'єм еталону, л": null,
        "Початкове значення, л": null,
        "Кінцеве значення, л": null,
        "Об'єм за лічильником, л": null,
        "Тривалість тесту, с": null,
        "Середня витрата, м³/год": null,
        "Статус витрати": "",
        "Фактична похибка, %": null,
        "Результат теста": "",
        "Фото старт": "",
        "Фото фініш": "",
      },
    ]
    
  };

  
  module.exports = parseLinesToModel;   
  