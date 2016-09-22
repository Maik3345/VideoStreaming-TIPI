<?php

class Application
{# Modulo: almacena el nombre del modulo de la URL

  private $url_module = null;

  # Controller: almacena el nombre del controlador de la URL
  private $url_controller = null;

  # Metodo (del controlador definido), a menudo también llamado "acción"
  private $url_action = null;

  # Array con los parametros o variables pasadas en la URL
  private $url_params = array();

  private $_Mdl_Vistas_Usuario = null;
  /**
  * El siguiente constructor da inicio a la aplicación:
  * Analiza los elementos llamados en la URL
  * Modulo/Controlador/Metodo/Parametros
  */
  public function __construct() {
    //_* Crear array con las partes de la URL en la variable $url
    $this->splitUrl();
    



    /**
    * Valida si se esta llamando y existete un modulo, controlador y/o metodo
    * y parametros, si no existe un modulo se redireccional al defaul (inicio.php),
    * lo mismo aplica para el controlador.
    */
    if (!$this->url_module) {
      require APP . 'controller/home.php';
      $page = new Home();
      $page->Index();
    } else {
      if (!$this->url_controller) {
        require APP . 'controller/home.php';
        $page = new Home();
        $page->Index();
      } elseif (file_exists(APP . 'controller/' . $this->url_module . '/' . $this->url_controller . '.php')) {
        /* Aqui se comprueba si existe el controlador
        * Si es así, entonces carga ese archivo y crear este controlador
        * Ejemplo: si el controlador fuera "car", entonces esta linea se traduce asi: $this->car = new car();
        */

        require APP . 'controller/' . $this->url_module . '/' . $this->url_controller . '.php';
        $this->url_controller = new $this->url_controller();

        //_* Verificar la presencia de un método: ¿ese método existen en el controlador?
        if (method_exists($this->url_controller, $this->url_action)) {
          if (!empty($this->url_params)) {
            //_* Llamar al método y pasarle los argumentos si tiene
            call_user_func_array(array($this->url_controller, $this->url_action), $this->url_params);
          } else {
            //_* Si no hay parámetros, se llama el método sin parámetros, como $this->home->method();
            $this->url_controller->{$this->url_action}();
          }
        } else {
          if (strlen($this->url_action) == 0) {
            //_* Si no hay ninguna acción definida: se llama el método Index() por defecto un controlador seleccionado
            //_* Recuerda que es obligatorio definir el metodo Index() en cada controlador
            $this->url_controller->Index();
          } else {
            header('location: ' . URL . 'Error/Error');
          }
        }
      } else {
        header('location: ' . URL . 'Error/Error');
      }
    } //_* Fin primera validación
  }

  /**
  * Get and split the URL
  */
  private function splitUrl() {
    if (isset($_GET['url'])) {

      //_* dividir URL
      $url = trim($_GET['url'], '/');
      $url = filter_var($url, FILTER_SANITIZE_URL);
      $url = explode('/', $url);

      //_* Colocar cada parte de la URL en su respectiva variable
      $this->url_module = isset($url[0]) ? $url[0] : null;
      $this->url_controller = isset($url[1]) ? $url[1] : null;
      $this->url_action = isset($url[2]) ? $url[2] : null;

      //_* Remueve el Modulo,Controlador y Metodo del URL, para que sea mas sencillo manipular los parametros.
      unset($url[0], $url[1], $url[2]);

      //_* Almacenar los valores de los parametros
      $this->url_params = array_values($url);

      //_* Descomenta esto si estas experimentando problemas con la URL:
      //_* echo 'Module: ' . $this->url_module . '<br>';
      //_* echo 'Controller: ' . $this->url_controller . '<br>';
      //_* echo 'Action: ' . $this->url_action . '<br>';
      //_* echo 'Parameters: ' . print_r($this->url_params, true) . '<br>';
    }
  }



}
