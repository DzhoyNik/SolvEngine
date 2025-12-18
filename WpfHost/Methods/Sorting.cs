using System;

class Sorting
{
    private int[] _array;

    public Sorting(int[] array)
    {
        _array = (int[])array.Clone(); // сохраняем копию
    }

    public int[] BubbleSort(bool ascending = true)
    {
        int[] arr = (int[])_array.Clone();
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++)
        {
            for (int j = 0; j < n - i - 1; j++)
            {
                if ((ascending && arr[j] > arr[j + 1]) || (!ascending && arr[j] < arr[j + 1]))
                {
                    Swap(arr, j, j + 1);
                }
            }
        }
        return arr;
    }

    public int[] InsertionSort(bool ascending = true)
    {
        int[] arr = (int[])_array.Clone();
        for (int i = 1; i < arr.Length; i++)
        {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && ((ascending && arr[j] > key) || (!ascending && arr[j] < key)))
            {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    public int[] ShakerSort(bool ascending = true)
    {
        int[] arr = (int[])_array.Clone();
        int left = 0, right = arr.Length - 1;

        while (left < right)
        {
            for (int i = left; i < right; i++)
            {
                if ((ascending && arr[i] > arr[i + 1]) || (!ascending && arr[i] < arr[i + 1]))
                    Swap(arr, i, i + 1);
            }
            right--;

            for (int i = right; i > left; i--)
            {
                if ((ascending && arr[i] < arr[i - 1]) || (!ascending && arr[i] > arr[i - 1]))
                    Swap(arr, i, i - 1);
            }
            left++;
        }
        return arr;
    }

    public int[] QuickSort(bool ascending = true)
    {
        int[] arr = (int[])_array.Clone();
        QuickSortInternal(arr, 0, arr.Length - 1, ascending);
        return arr;
    }

    private void QuickSortInternal(int[] arr, int low, int high, bool ascending)
    {
        if (low < high)
        {
            int pi = Partition(arr, low, high, ascending);
            QuickSortInternal(arr, low, pi - 1, ascending);
            QuickSortInternal(arr, pi + 1, high, ascending);
        }
    }

    private int Partition(int[] arr, int low, int high, bool ascending)
    {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++)
        {
            if ((ascending && arr[j] <= pivot) || (!ascending && arr[j] >= pivot))
            {
                i++;
                Swap(arr, i, j);
            }
        }
        Swap(arr, i + 1, high);
        return i + 1;
    }

    public int[] BogoSort(bool ascending = true)
    {
        int[] arr = (int[])_array.Clone();
        Random rnd = new Random();

        while (!IsSorted(arr, ascending))
        {
            for (int i = 0; i < arr.Length; i++)
            {
                int j = rnd.Next(arr.Length);
                Swap(arr, i, j);
            }
        }
        return arr;
    }

    private bool IsSorted(int[] arr, bool ascending)
    {
        for (int i = 0; i < arr.Length - 1; i++)
        {
            if ((ascending && arr[i] > arr[i + 1]) || (!ascending && arr[i] < arr[i + 1]))
                return false;
        }
        return true;
    }

    private void Swap(int[] arr, int i, int j)
    {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
